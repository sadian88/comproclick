export interface ProjectData {
  projectType?: string;
  projectTypeOther?: string;
  projectCategory?: string;
  projectCategoryOther?: string;
  timeline?: string;
  fullName?: string;
  companyName?: string;
  phone?: string;
  email?: string;
  country?: string;
  idea?: string;
  refinedIdea?: string; // Stored separately, user might choose to use it
}

export type StepKey = 'hero' | 'type' | 'category' | 'timeline' | 'contact' | 'summary';

export const initialProjectData: ProjectData = {
  projectType: '',
  projectTypeOther: '',
  projectCategory: '',
  projectCategoryOther: '',
  timeline: '',
  fullName: '',
  companyName: '',
  phone: '',
  email: '',
  country: '',
  idea: '',
  refinedIdea: '',
};
