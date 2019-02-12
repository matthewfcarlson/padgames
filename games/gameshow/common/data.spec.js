const data = require("./data")


describe("questions", () => {
    it("it should have questions", () => {
        const questions = data.questions;
        expect(questions).not.toBeUndefined();
        expect(questions[0]).not.toBeUndefined();
    });
});
describe("questions and answers", () => {
    it("Should have the same number questions as answers", () => {
        const questions = data.questions;
        const answers = data.answers;
        const numQuestions = questions.length;
        for (const item in answers) {
            console.log(item);
            const personsAnswers = answers[item];
            expect(personsAnswers.length).toBe(numQuestions);
        }
    });
});
describe("answers", () => {
    it("it should have answers", () => {
        const answers = data.answers;
        expect(answers).not.toBeUndefined();
        expect(Object.keys(answers)).not.toBeUndefined();
        expect(Object.keys(answers)).toHaveLength(3);
    });
    it("each person has the same number of answers", () => {
        const answers = data.answers;

    });
    it("each answer is unique", () => {
        const answers = data.answers;
        const numQuestions = data.questions.length;
        for (var i = 0; i < numQuestions; i++) {
            var foundAnswers = [];
            for (const item in answers) {
                const answer = answers[item][i];
                expect(foundAnswers).not.toContain(answer);
                foundAnswers.push(answer);
            }
        }

    });

});