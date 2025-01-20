// testStore.js
let testUserId = 35; // default test user

const setTestUserId = (id) => {
    testUserId = id;
};

const getTestUserId = () => {
    return testUserId;
};

module.exports = {
    setTestUserId,
    getTestUserId
};