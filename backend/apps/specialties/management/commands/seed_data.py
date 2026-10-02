from django.core.management.base import BaseCommand
from apps.specialties.models import Specialty, Module
from apps.resources.models import Resource


class Command(BaseCommand):
    help = "Initialise les 8 spécialités, les modules et les ressources approuvées / en attente"

    def handle(self, *args, **options):
        # (code, nom complet, slug, couleur, icône, [(code_module, titre, semestre, coeff), ...])
        specialties_data = [
            ("SSI", "Sécurité des Systèmes Informatiques", "ssi", "#10b981", "ShieldAlert", [
                ("ARMO",  "Arithmétique modulaire",                                         "S1", 4),
                ("ARIN",  "Architectures des réseaux informatiques",                        "S1", 5),
                ("INSI",  "Introduction à la sécurité informatique",                        "S1", 5),
                ("SYEX",  "Systèmes d'exploitation",                                        "S1", 5),
                ("VTB D", "Veille technologique et Bases de données avancées",              "S1", 5),
                ("CALG",  "Complexité algorithmique",                                       "S1", 3),
                ("AJSI",  "Aspects juridiques dans la sécurité informatique",               "S1", 1),
                ("ANIN",  "Anglais pour l'informatique",                                    "S1", 2),
            ]),
            ("SII", "Systèmes d'Information Intelligents", "sii", "#8b5cf6", "BrainCircuit", [
                ("algo",        "Algorithmique Avancée et Complexité",                              "S1", 3),
                ("RP",          "Résolution de problèmes",                                          "S1", 3),
                ("compil",      "Compilation : génération du code et optimisation",                 "S1", 3),
                ("SE",          "Systèmes d'exploitation",                                          "S1", 3),
                ("MEPS",        "Modélisation et évaluation des performances des systèmes",         "S1", 3),
                ("admin reseau","Architecture et administration des réseaux",                        "S1", 3),
                ("Anglais",     "Anglais",                                                           "S1", 2),
            ]),
            ("IL", "Ingénierie du Logiciel", "il", "#f59e0b", "Code2", [
                ("ALGO",           "Algorithmique Avancée et Complexité",                            "S1", 3),
                ("compil 1 ou GL", "Systèmes d'Information et Génie Logiciel OU Compilation1",      "S1", 3),
                ("Arch et admin bdd", "Architecture et Administration de bases de Données",         "S1", 3),
                ("MEPS",           "Modélisation et évaluation des performances des systèmes",      "S1", 3),
                ("SE",             "Systèmes d'exploitation",                                       "S1", 3),
                ("GP",             "Gestion de Projets de Logiciels",                               "S1", 3),
                ("Anglais",        "Anglais",                                                        "S1", 3),
            ]),
            ("HPC", "High Performance Computing", "hpc", "#f43f5e", "Cpu", [
                ("ALGO",      "Algorithmique Avancée et Complexité",           "S1", 3),
                ("ARCH",      "Architectures Avancées",                         "S1", 3),
                ("bdd AVAN",  "Bases de données Avancées",                      "S1", 3),
                ("SE",        "Systèmes d'exploitation",                        "S1", 3),
                ("MS",        "Modélisation et Simulation",                     "S1", 2),
                ("MATH",      "Mathématiques appliquées (Analyse numérique)",   "S1", 2),
                ("ANG",       "Anglais",                                         "S1", 1),
            ]),
            ("BIGDATA", "Big Data et Analytics", "bigdata", "#0ea5e9", "Database", [
                ("PRAVEAN", "Programmation avancée",                                                    "S1", 3),
                ("GDB",     "Graphes et Big Data",                                                      "S1", 3),
                ("BADO",    "Bases de Données (Option)",                                                 "S1", 3),
                ("GP",      "Gestion de projet",                                                        "S1", 3),
                ("ANG",     "Anglais",                                                                   "S1", 3),
                ("SAAD",    "Stratégie de sécurité pour l'aide à la décision",                          "S1", 3),
                ("THOR",    "Théorie de l'ordonnancement",                                               "S1", 3),
                ("VT",      "Veille Technologie",                                                        "S1", 3),
                ("OL",      "Optimisation linéaire (option)",                                            "S1", 3),
                ("POO",     "Programmation Orientée Objet (option)",                                     "S1", 3),
                ("CPSI",    "Calcul de probabilités et statistique inférentielle (option)",              "S1", 3),
            ]),
            ("BIOINFO", "Bioinformatique", "bioinfo", "#14b8a6", "Dna", [
                ("AAC",     "Algorithmique Avancée et Complicité",      "S1", 3),
                ("BIOGEN",  "Bioinfo et Génomique",                     "S1", 4),
                ("BIOSTAT", "Biostatistique",                           "S1", 3),
                ("BIOMATH", "Biomathématique",                          "S1", 3),
                ("SPS",     "Système et Programmation de Scripts",      "S1", 3),
                ("GPR",     "Gestion de Projet",                        "S1", 3),
                ("ANG1",    "ANGLAIS",                                   "S1", 3),
            ]),
            ("RSD", "Réseaux et Systèmes Distribués", "rsd", "#d946ef", "Network", [
                ("Algo",    "Algorithmique Avancée et Complexité",                              "S1", 3),
                ("RP",      "Réseaux et Protocoles",                                            "S1", 3),
                ("ASGBD",   "Architecture et Administration de SGBD",                           "S1", 3),
                ("GP",      "Gestion de Projet de Développement de Logiciels",                  "S1", 3),
                ("MEPS",    "Modélisation et Evaluation de Performances des Systèmes",          "S1", 3),
                ("SE",      "Systèmes d'exploitation",                                          "S1", 3),
                ("Anglais", "Anglais",                                                           "S1", 1),
            ]),
            ("IV", "Master Informatique Visuelle", "iv", "#ec4899", "Monitor", [
                ("ALGC",  "Algorithmes Avancé et Complexité",         "S1", 3),
                ("ABD",   "Architecture des Bases de données",        "S1", 3),
                ("RP",    "Résolution de problèmes",                  "S1", 3),
                ("SE",    "Systèmes d'exploitation",                  "S1", 3),
                ("TAI",   "Traitement et analyse d'images",           "S1", 3),
                ("CM",    "Communication Multimédia",                 "S1", 3),
                ("ANG",   "Anglais",                                   "S1", 1),
            ]),
        ]

        Resource.objects.all().delete()

        for idx, (code, name, slug, color, icon, modules) in enumerate(specialties_data, start=1):
            spec, created = Specialty.objects.update_or_create(
                code=code,
                defaults={
                    "name": name, "slug": slug, "accent_color": color,
                    "icon_name": icon, "order": idx,
                    "description": f"Master {name} — Université d'Alger"
                }
            )
            action = "✅ Créée" if created else "🔄 Mise à jour"
            self.stdout.write(f"{action} spécialité : {code}")

            for mod_data in modules:
                if len(mod_data) == 4:
                    m_code, title, semester, coeff = mod_data
                else:
                    m_code, title, semester = mod_data
                    coeff = 3
                mod, _ = Module.objects.update_or_create(
                    specialty=spec, code=m_code,
                    defaults={"title": title, "semester": semester, "coefficient": coeff}
                )
                # Ressource Drive approuvée (exemple)
                Resource.objects.create(
                    module=mod, resource_type='DRIVE',
                    title=f"Polycopié de cours 2026-2027 — {title}",
                    url="https://drive.google.com", category='COURS',
                    status=Resource.StatusChoices.APPROVED, views_count=45
                )
                # Ressource YouTube approuvée (exemple)
                Resource.objects.create(
                    module=mod, resource_type='YOUTUBE',
                    title=f"Cours vidéo complet : {title}",
                    url="https://youtube.com", channel_name=f"Master {code} Algérie",
                    duration="48m", status=Resource.StatusChoices.APPROVED
                )

        # Propositions en attente pour tester le dashboard délégué
        crypto_mod = Module.objects.filter(code='ARMO').first() or Module.objects.first()
        rsd_mod    = Module.objects.filter(specialty__code='RSD').first() or Module.objects.last()

        if crypto_mod:
            Resource.objects.create(
                module=crypto_mod, resource_type='DRIVE',
                title="Sujet d'examen avec corrigé détaillé — Session Janvier 2027",
                url="https://drive.google.com/open?id=demo_exam_corrigee",
                category='EXAM', contributor_name="Yassine (M1 SSI)",
                status=Resource.StatusChoices.PENDING
            )
        if rsd_mod:
            Resource.objects.create(
                module=rsd_mod, resource_type='DRIVE',
                title="Fiche de révision synthèse — Réseaux et Protocoles",
                url="https://drive.google.com/open?id=demo_fiche_rsd",
                category='SUMMARY', contributor_name="Sarah (M1 RSD)",
                status=Resource.StatusChoices.PENDING
            )

        # ── Création des comptes utilisateurs par défaut ──────────────────────
        from django.contrib.auth import get_user_model
        import os
        UserModel = get_user_model()

        admin_pwd  = os.getenv('SEED_ADMIN_PASSWORD', 'admin123')
        hache_pwd  = os.getenv('SEED_HACHE_PASSWORD', 'hache1234')
        ssi_pwd    = os.getenv('SEED_SSI_PASSWORD',   'ssi123')
        rsd_pwd    = os.getenv('SEED_RSD_PASSWORD',   'rsd123')

        # Admin global
        admin_user, created = UserModel.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@masterinfo.univ.fr",
                "is_staff": True, "is_superuser": True,
                "is_delegate": True, "specialty": None,
            }
        )
        if created:
            admin_user.set_password(admin_pwd)
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f"Admin créé : admin / {admin_pwd}"))

        # Superuser hache21
        hache_user, created = UserModel.objects.get_or_create(
            username="hache21",
            defaults={
                "email": "hac@gmail.com",
                "is_staff": True, "is_superuser": True,
                "is_delegate": True, "specialty": None,
            }
        )
        if created:
            hache_user.set_password(hache_pwd)
            hache_user.save()
            self.stdout.write(self.style.SUCCESS("Compte hache21 créé."))

        # Délégué SSI
        ssi_spec = Specialty.objects.filter(code="SSI").first()
        del_ssi, created = UserModel.objects.get_or_create(
            username="delegue_ssi",
            defaults={
                "email": "delegue.ssi@masterinfo.univ.fr",
                "is_staff": False, "is_superuser": False,
                "is_delegate": True, "specialty": ssi_spec,
            }
        )
        if created:
            del_ssi.set_password(ssi_pwd)
            del_ssi.save()
            self.stdout.write(self.style.SUCCESS(f"Délégué SSI créé : delegue_ssi / {ssi_pwd}"))

        # Délégué RSD
        rsd_spec = Specialty.objects.filter(code="RSD").first()
        del_rsd, created = UserModel.objects.get_or_create(
            username="delegue_rsd",
            defaults={
                "email": "delegue.rsd@masterinfo.univ.fr",
                "is_staff": False, "is_superuser": False,
                "is_delegate": True, "specialty": rsd_spec,
            }
        )
        if created:
            del_rsd.set_password(rsd_pwd)
            del_rsd.save()
            self.stdout.write(self.style.SUCCESS(f"Délégué RSD créé : delegue_rsd / {rsd_pwd}"))

        self.stdout.write(self.style.SUCCESS(
            "\n🎉 Base initialisée : 8 spécialités, tous modules 2026-2027, ressources et utilisateurs !"
        ))
