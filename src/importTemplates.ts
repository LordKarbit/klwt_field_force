import type { Role } from './api';

export type ImportTemplateKey = 'User import' | 'Target store import' | 'Master survey options' | 'Territory master';

export type ImportTemplate = {
  title: string;
  kind: string;
  roles: Role[];
  filename: string;
  sheetName: string;
  headers: string[];
};

export const importTemplates: Record<ImportTemplateKey, ImportTemplate> = {
  'User import': {
    title: 'Import User',
    kind: 'user-import',
    roles: ['Administrator'],
    filename: 'klwt-user-import-template.xlsx',
    sheetName: 'User Import',
    headers: ['name', 'username', 'password', 'phone', 'role', 'manager_username', 'area', 'status'],
  },
  'Target store import': {
    title: 'Import Target Store',
    kind: 'target-store-import',
    roles: ['Manager', 'Administrator'],
    filename: 'klwt-target-store-import-template.xlsx',
    sheetName: 'Target Store',
    headers: [
      'store_name',
      'province',
      'city_regency',
      'district',
      'village',
      'address_detail',
      'landmark',
      'latitude',
      'longitude',
      'assigned_manager',
      'assigned_surveyor',
      'visit_date',
      'priority',
      'notes',
    ],
  },
  'Master survey options': {
    title: 'Import Master Survey Options',
    kind: 'master-survey-options',
    roles: ['Administrator'],
    filename: 'klwt-master-survey-options-template.xlsx',
    sheetName: 'Survey Options',
    headers: ['question_code', 'question_label', 'option_value', 'option_label', 'sort_order', 'is_active'],
  },
  'Territory master': {
    title: 'Import Territory Master',
    kind: 'territory-master',
    roles: ['Administrator'],
    filename: 'klwt-territory-master-template.xlsx',
    sheetName: 'Territory Master',
    headers: ['province', 'city', 'district', 'village', 'manager_username', 'surveyor_username', 'is_active'],
  },
};
