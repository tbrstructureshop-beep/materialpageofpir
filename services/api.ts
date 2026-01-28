
import { DashboardData, Material } from '../types';

const API_URL = "https://script.google.com/macros/s/AKfycbyQG9-FrBkQidkbUzWgVUUHxK7mFVYyru5RO7EKyfOzomliEn8KBCF_bkagjNw_CK8r/exec";

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as DashboardData;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export const saveMaterialData = async (findingName: string, materials: Material[]): Promise<{ status: string }> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ findingName, materials }),
      // Note: GAS requires a redirect for POST, fetch handles this automatically 
      // when deployed as a Web App with 'Anyone' access.
    });
    
    // In some CORS configurations with GAS, we might not get a standard JSON response 
    // if using 'no-cors', but here we assume standard Web App deployment.
    if (!response.ok) {
      throw new Error(`Save failed with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error saving material data:", error);
    throw error;
  }
};
