/* Registro dos animais: cada pasta em animais/ chama registerAnimal() com seus dados, ícone, modelo e comportamento. */
const SPECIES = {}, Registry = {};
function registerAnimal(key, def) {
  Registry[key] = def; SPECIES[key] = def.data; ICONS[key] = def.icon;
}

/* Registro das plantas: cada pasta em plantas/ chama registerPlant(). kind: 'tree' (árvore) ou 'bush' (arbusto). */
const PlantRegistry = {};
function registerPlant(key, def) { PlantRegistry[key] = def; }
