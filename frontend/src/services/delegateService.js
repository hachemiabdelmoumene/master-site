import { request } from './api';

export const delegateService = {
  async getPendingResources() {
    try {
      const data = await request('/delegate/pending-resources/');
      return Array.isArray(data) ? data : (data.results || []);
    } catch (error) {
      console.error('Erreur récupération ressources en attente:', error);
      throw error;
    }
  },

  async approveResource(id) {
    try {
      return await request(`/delegate/resources/${id}/approve/`, { method: 'PATCH' });
    } catch (error) {
      console.error(`Erreur approbation ressource #${id}:`, error);
      throw error;
    }
  },

  async rejectResource(id, reason = '') {
    try {
      return await request(`/delegate/resources/${id}/reject/`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
    } catch (error) {
      console.error(`Erreur rejet ressource #${id}:`, error);
      throw error;
    }
  },

  async createDirect(resourceData) {
    try {
      return await request('/delegate/resources/create/', {
        method: 'POST',
        body: JSON.stringify(resourceData),
      });
    } catch (error) {
      console.error('Erreur création directe ressource:', error);
      throw error;
    }
  },

  async deleteResource(id) {
    try {
      return await request(`/delegate/resources/${id}/`, { method: 'DELETE' });
    } catch (error) {
      console.error(`Erreur suppression ressource #${id}:`, error);
      throw error;
    }
  },

  async getStats() {
    try {
      return await request('/delegate/stats/');
    } catch (error) {
      console.error('Erreur récupération statistiques délégué:', error);
      return { pending_count: 0, approved_count: 0, rejected_count: 0, total_resources: 0 };
    }
  },
};
