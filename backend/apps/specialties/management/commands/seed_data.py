from django.core.management.base import BaseCommand
from apps.specialties.models import Specialty, Module
from apps.resources.models import Resource


class Command(BaseCommand):
    help = "Initialise les 7 spécialités, les modules et les ressources approuvées / en attente"

    def handle(self, *args, **options):
        specialties_data = [
            ("SSI", "Sécurité des Systèmes Informatiques", "ssi", "#10b981", "ShieldAlert", [
                ("CRYPTO", "Cryptographie Avancée", "S1"),
                ("SECNET", "Sécurité des Réseaux et Protocoles", "S1"),
                ("MALWARE", "Analyse de Malwares & Rétro-ingénierie", "S2"),
            ]),
            ("SII", "Systèmes d'Information Intelligents", "sii", "#8b5cf6", "BrainCircuit", [
                ("ML_ADV", "Apprentissage Automatique Avancé", "S1"),
                ("NLP", "Traitement Automatique du Langage Naturel", "S2"),
            ]),
            ("IL", "Ingénierie du Logiciel", "il", "#f59e0b", "Code2", [
                ("ARCHI", "Architectures Logicielles et Design Patterns", "S1"),
                ("DEVOPS", "DevOps, CI/CD et Conteneurisation", "S1"),
            ]),
            ("M1 HPC", "High Performance Computing", "m1-hpc", "#f43f5e", "Cpu", [
                ("PARAL", "Calcul Parallèle et Distribué", "S1"),
                ("CUDA", "Programmation GPU & Accélération CUDA", "S1"),
            ]),
            ("BIGDATA", "Big Data et Analytics", "bigdata", "#0ea5e9", "Database", [
                ("SPARK", "Traitement Distribué avec Apache Spark", "S1"),
                ("STREAM", "Streaming de Données Temps Réel (Kafka)", "S2"),
            ]),
            ("BIOINFO", "Bioinformatique", "bioinfo", "#14b8a6", "Dna", [
                ("GENOM", "Algorithmique du Séquençage Génomique", "S1"),
                ("STRUCT", "Bioinformatique Structurale et Protéines", "S2"),
            ]),
            ("RSD", "Réseaux et Systèmes Distribués", "rsd", "#d946ef", "Network", [
                ("PROTOC", "Protocoles Réseaux Avancés & SDN", "S1"),
                ("DISTRIB", "Systèmes et Algorithmes Distribués", "S1"),
            ]),
        ]

        Resource.objects.all().delete()

        for idx, (code, name, slug, color, icon, modules) in enumerate(specialties_data, start=1):
            spec, _ = Specialty.objects.update_or_create(
                code=code,
                defaults={
                    "name": name, "slug": slug, "accent_color": color,
                    "icon_name": icon, "order": idx, "description": f"Master {name}"
                }
            )
            for m_code, title, semester in modules:
                mod, _ = Module.objects.update_or_create(
                    specialty=spec, code=m_code,
                    defaults={"title": title, "semester": semester, "coefficient": 3}
                )
                # Ressource Drive approuvée
                Resource.objects.create(
                    module=mod, resource_type='DRIVE',
                    title=f"Polycopié de cours 2024 - {m_code}",
                    url="https://drive.google.com", category='COURS',
                    status=Resource.StatusChoices.APPROVED, views_count=45
                )
                # Ressource YouTube approuvée
                Resource.objects.create(
                    module=mod, resource_type='YOUTUBE',
                    title=f"Introduction vidéo complète : {title}",
                    url="https://youtube.com", channel_name=f"Master {code} France",
                    duration="48m", status=Resource.StatusChoices.APPROVED
                )

        # Ajout de propositions d'étudiants en attente pour tester le dashboard délégué
        crypto_mod = Module.objects.filter(code='CRYPTO').first() or Module.objects.first()
        rsd_mod = Module.objects.filter(code='DISTRIB').first() or Module.objects.last()

        Resource.objects.create(
            module=crypto_mod, resource_type='DRIVE',
            title="Sujet d'examen avec corrigé détaillé Janvier 2024",
            url="https://drive.google.com/open?id=demo_exam_corrigee",
            category='EXAM', contributor_name="Yassine (M1 SSI)",
            status=Resource.StatusChoices.PENDING
        )
        Resource.objects.create(
            module=crypto_mod, resource_type='YOUTUBE',
            title="Tutoriel complet : Installation Sandbox Pentest & Wireshark",
            url="https://youtube.com/watch?v=demo_pentest",
            channel_name="CyberHacker Académie", duration="32m",
            contributor_name="Étudiant Anonyme",
            status=Resource.StatusChoices.PENDING
        )
        Resource.objects.create(
            module=rsd_mod, resource_type='DRIVE',
            title="Fiche de révision synthèse pour les partiels Réseaux",
            url="https://drive.google.com/open?id=demo_fiche",
            category='SUMMARY', contributor_name="Sarah (M1 RSD)",
            status=Resource.StatusChoices.PENDING
        )
        # Création des comptes Administrateur et Délégués par défaut
        from django.contrib.auth import get_user_model
        UserModel = get_user_model()

        import os
        admin_pwd = os.getenv('SEED_ADMIN_PASSWORD', 'admin123')
        hache_pwd = os.getenv('SEED_HACHE_PASSWORD', 'hache1234')
        ssi_pwd = os.getenv('SEED_SSI_PASSWORD', 'ssi123')
        rsd_pwd = os.getenv('SEED_RSD_PASSWORD', 'rsd123')

        # 1. Compte Administrateur Global (Tous les Masters)
        admin_user, created = UserModel.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@masterinfo.univ.fr",
                "is_staff": True,
                "is_superuser": True,
                "is_delegate": True,
                "specialty": None,
            }
        )
        if created:
            admin_user.set_password(admin_pwd)
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f"Compte Admin global créé : admin / {admin_pwd}"))

        # 2. Compte Superutilisateur hache21 (si pas encore créé)
        hache_user, created = UserModel.objects.get_or_create(
            username="hache21",
            defaults={
                "email": "hac@gmail.com",
                "is_staff": True,
                "is_superuser": True,
                "is_delegate": True,
                "specialty": None,
            }
        )
        if created:
            hache_user.set_password(hache_pwd)
            hache_user.save()

        # 3. Compte Délégué SSI (Sécurité)
        ssi_spec = Specialty.objects.filter(code="SSI").first()
        del_ssi, created = UserModel.objects.get_or_create(
            username="delegue_ssi",
            defaults={
                "email": "delegue.ssi@masterinfo.univ.fr",
                "is_staff": False,
                "is_superuser": False,
                "is_delegate": True,
                "specialty": ssi_spec,
            }
        )
        if created:
            del_ssi.set_password(ssi_pwd)
            del_ssi.save()
            self.stdout.write(self.style.SUCCESS(f"Compte Délégué SSI créé : delegue_ssi / {ssi_pwd}"))

        # 4. Compte Délégué RSD (Réseaux)
        rsd_spec = Specialty.objects.filter(code="RSD").first()
        del_rsd, created = UserModel.objects.get_or_create(
            username="delegue_rsd",
            defaults={
                "email": "delegue.rsd@masterinfo.univ.fr",
                "is_staff": False,
                "is_superuser": False,
                "is_delegate": True,
                "specialty": rsd_spec,
            }
        )
        if created:
            del_rsd.set_password(rsd_pwd)
            del_rsd.save()
            self.stdout.write(self.style.SUCCESS(f"Compte Délégué RSD créé : delegue_rsd / {rsd_pwd}"))

        self.stdout.write(self.style.SUCCESS("Base de données réinitialisée avec utilisateurs, spécialités et ressources !"))


