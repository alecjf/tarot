import { randomItem } from "../../scripts/misc";

function translatePeople(people) {
    const peopleKey = {
        Page: `${randomItem(["vibrant", "gregarious", "energetic"])} person`,
        Knight: `${randomItem(["bold", "aggressive"])} personality`,
        Queen: "strong woman",
        King: "powerful man",
    };
    return people.map((person) => peopleKey[person]);
}

function aOrAn(word) {
    return (
        (["A", "E", "I", "O", "U"].includes(word.charAt(0).toUpperCase())
            ? "an "
            : "a ") + word
    );
}

const sentenceHandlers = {
    matchingAdj0People: ({ adj1 }) =>
        randomItem([
            `The situation at hand is very ${adj1}.`,
            `The situation at hand lacks ${adj1} energy.`,
        ]),
    matchingAdj1People: ({ adj1, person1 }) =>
        randomItem([
            `${aOrAn(adj1)}, ${person1} is bothering you.`,
            `You are interested in ${aOrAn(adj1)}, ${person1}.`,
        ]),
    matchingAdj2People: ({ adj1, person1, person2 }) =>
        randomItem([
            `${aOrAn(person1)} and ${aOrAn(person2)} are having ${aOrAn(
                adj1
            )} relationship.`,
        ]),
    matchingNoun0People: ({ noun1 }) =>
        randomItem([`Beware ${noun1}.`, `Be open to ${noun1}.`]),
    matchingNoun1People: ({ noun, person1 }) =>
        randomItem([
            `${aOrAn(person1)} in your life lacks ${noun}.`,
            `${aOrAn(person1)} in your life has too much ${noun}.`,
            `Look for ${aOrAn(person1)} with ${noun}.`,
            `Avoid ${aOrAn(person1)} with ${noun}.`,
        ]),
    matchingNoun2People: ({ noun1, person1, person2 }) =>
        randomItem([
            `Beware of ${noun1} among ${aOrAn(person1)} or ${aOrAn(person2)}.`,
            `Seek out ${noun1} among ${aOrAn(person1)} or ${aOrAn(person2)}.`,
        ]),
    oppositesAdjAdj0People: ({ adj1, adj2 }) =>
        randomItem([
            `Despite ${adj1} influences, you find yourself in ${aOrAn(
                adj2
            )} situation.`,
            `Everything seems ${adj1}, but it's really ${adj2}.`,
        ]),
    oppositesAdjAdj1People: ({ adj1, adj2, person1 }) =>
        randomItem([
            `A ${person1} is all ${adj1} and no ${adj2}.`,
            `${aOrAn(adj1)}, ${person1} will soon become ${adj2}.`,
            `${aOrAn(person1)} who seems ${adj1} is actually ${adj2}.`,
        ]),
    oppositesAdjAdj2People: ({ adj1, adj2, person1, person2 }) =>
        randomItem([
            `${aOrAn(adj1)}, ${person1} is clashing with ${aOrAn(
                adj2
            )} ${person2}.`,
            `Focus more on ${aOrAn(adj1)}, ${person1} and less on ${aOrAn(
                adj2
            )}, ${person2}.`,
        ]),
    oppositesAdjNoun0People: ({ adj1, noun1 }) =>
        randomItem([
            `Balance ${noun1} by being ${adj1}.`,
            `Things seem ${adj1} even though there is ${noun1}.`,
        ]),
    oppositesAdjNoun1People: ({ adj1, noun1, person1 }) =>
        randomItem([
            `A normally ${adj1} ${person1} will soon experience ${noun1}`,
            `Just because ${aOrAn(
                person1
            )} is ${adj1} doesn't mean they don't have ${noun1}.`,
        ]),
    oppositesAdjNoun2People: ({ adj1, noun1, person1, person2 }) =>
        randomItem([
            `${aOrAn(person1)} with ${noun1} will team up with ${aOrAn(
                adj1
            )}, ${person2}.`,
            `${aOrAn(
                person1
            )} with ${noun1} from your past has now become ${adj1}.`,
        ]),
    oppositesNounNoun0People: ({ noun1, noun2 }) =>
        randomItem([
            `Embrace ${noun1} and reject ${noun2}.`,
            `You are focused on ${noun1} and ignoring ${noun2}.`,
        ]),
    oppositesNounNoun1People: ({ noun1, noun2, person1 }) =>
        randomItem([
            `${aOrAn(person1)} has ${noun1}, but no ${noun2}.`,
            `${aOrAn(person1)} loves ${noun1} and hates ${noun2}.`,
        ]),
    oppositesNounNoun2People: ({ noun1, noun2, person1, person2 }) =>
        randomItem([
            `${aOrAn(person1)} will gain ${noun1} while ${aOrAn(
                person2
            )} will lose ${noun2}.`,
            `Your past had ${aOrAn(
                person1
            )} with ${noun1}, but your future will have ${aOrAn(
                person2
            )} with ${noun2}`,
        ]),
    othersAdjAdj0People: ({ adj1, adj2 }) =>
        randomItem([
            `Your life feels both ${adj1} and ${adj2}.`,
            `Pay attention to ${adj1} and ${adj2} forces.`,
        ]),
    othersAdjAdj1People: ({ adj1, adj2, person1 }) =>
        randomItem([
            `${aOrAn(person1)} close to you will become ${adj1} and ${adj2}.`,
            `Listen to ${aOrAn(adj1)} and ${adj2}, ${person1}.`,
            `Ignore ${aOrAn(adj1)} and ${adj2}, ${person1}.`,
        ]),
    othersAdjAdj2People: ({ adj1, adj2, person1, person2 }) =>
        randomItem([
            `${aOrAn(
                adj1
            )}, ${person1} will soon leave and be replaced by ${aOrAn(
                adj2
            )}, ${person2}.`,
            `${aOrAn(adj1)}, ${person1} from your past has become ${aOrAn(
                adj2
            )}, ${person2}.`,
        ]),
    othersAdjNoun0People: ({ adj1, noun1 }) =>
        randomItem([
            `You will soon encounter ${aOrAn(adj1)} ${noun1}.`,
            `Expect ${aOrAn(adj1)} ${noun1}.`,
        ]),
    othersAdjNoun1People: ({ adj1, noun1, person1 }) =>
        randomItem([
            `${aOrAn(
                adj1
            )}, ${person1} from your past is bringing back ${noun1}.`,
            `${aOrAn(adj1)}, ${person1} will soon bring ${noun1}.`,
        ]),
    othersAdjNoun2People: ({ adj1, noun1, person1, person2 }) =>
        randomItem([
            `${aOrAn(person1)} with ${noun1} will help ${aOrAn(
                adj1
            )}, ${person2}.`,
            `${aOrAn(person1)} with ${noun1} will harm ${aOrAn(
                adj1
            )}, ${person2}.`,
        ]),
    othersNounNoun0People: ({ noun1, noun2 }) =>
        randomItem([
            `Your life has ${noun1} and not ${noun2}.`,
            `Your life has too much ${noun1} and ${noun2}.`,
            `${noun1} and ${noun2} are lacking in your life.`,
        ]),
    othersNounNoun1People: ({ noun1, noun2, person1 }) =>
        randomItem([
            `${aOrAn(person1)} will give you ${noun1} and ${noun2}.`,
            `${aOrAn(person1)} will take from you ${noun1} and ${noun2}.`,
        ]),
    othersNounNoun2People: ({ noun1, noun2, person1, person2 }) =>
        randomItem([
            `${aOrAn(person1)} and ${aOrAn(
                person2
            )} want both ${noun1} and ${noun2}.`,
            `${aOrAn(person1)} and ${aOrAn(
                person2
            )} want neither ${noun1} nor ${noun2}.`,
        ]),
};

export default sentenceHandlers;
