
const variables = {};

module.exports = {
    /**
    * @param {string} key - Global variable key
    * @param {string} value  - Global variable key
    */
    $set (key, value) {
        // eslint-disable-next-line security/detect-object-injection
        variables[key] = value;
    },

    /**
    * @param {string} key - Global variable key
    * @return {string} Global variable value
    */
    $get (key) {
        // eslint-disable-next-line security/detect-object-injection
        return variables[key];
    }
};
