// Function to return an array of all "category" types
export function getAllOfAttribute(stratagems,attr) {
    const attrSet = new Set();
    stratagems.forEach(stratagem => {
        if (Array.isArray(stratagem[attr])) {
            stratagem[attr].forEach(a=>attrSet.add(a));
        } else {
            attrSet.add(stratagem[attr]);
        }
    });
    return Array.from(attrSet);
}

// Function to return an array of stratagems that match a given category
export function getStratagemsByCategory(stratagems, category) {
    return stratagems.filter(stratagem => stratagem.category === category);
}