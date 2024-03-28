import stratagemsDataV1 from './stratagemsDataV1.json';
import stratagemsDataV2 from './stratagemsDataV2.json';
import stratagemsDataV3 from './stratagemsDataV3.json';

function v1ToV2(v1) {
    return v1.map((stratagem,index)=>{
        const tags = [];
        if (stratagem.traits) {
            stratagem.traits.forEach(trait=>tags.push(`trait:${trait}`));
        }
        if (stratagem.category) {
            tags.push(`cat:${stratagem.category}`);
        }
        if (stratagem.permitType) {
            tags.push(`permit:${stratagem.permitType}`);
        }
        return ({
            ...stratagem,
            tags,
            id: `sg-${index.toString().padStart(3,'0')}`
        } )})
}

function v2ToV3(v2) {
    return v2.reduce((a,c)=>({...a, [c.id]: c}),{});
}

window.v1ToV2 = v1ToV2;
window.v2ToV3 = v2ToV3;

export function getAllCategories(stratagems) {
    const categories = new Set();

    stratagems.forEach(stratagem=>categories.add(stratagem.category ?? 'Uncategorized'));

    return Array.from(categories).sort();
}

export {
    stratagemsDataV1,
    stratagemsDataV2,
    stratagemsDataV3,
};

export default stratagemsDataV2;
