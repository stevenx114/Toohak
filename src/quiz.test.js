describe('AdminQuizList', () => {
    beforeEach(() => {
        const userId = adminAuthRegister('voxekov792@estudys.com', 'quickbrown', 'Alex', 'Smith');
        const quiz = adminQuizCreate(userId.authUserId, 'human history', 'description');
    });
  
    describe('error cases:', () => {
        test('invalid AuthUserId', () => {
            expect(adminQuizList(userId.authUserId + 0.003)).toStrictEqual(ERROR);
        });
    });
    
    describe('success cases:', () => {
        test('valid input', () => {
            expect(adminQuizList(userId.authUserId)).toStrictEqual({
                quizzes: [
                    {
                        quizId: quiz.quizId,
                        name: 'human history',
                    }
                ]
            });
        });
    });
  });