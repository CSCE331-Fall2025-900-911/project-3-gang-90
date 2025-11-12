import * as menuRepository from '../data/menuRepository.js';

export function getMenu() {
  // could add sorting, validation, permissions here
  return menuRepository.findAll();
}