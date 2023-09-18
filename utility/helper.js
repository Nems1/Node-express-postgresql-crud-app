const bcrypt = require('bcrypt')

function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
}
function emptyOrRows(rows) { 
    if (!rows) {
        console.log("No data found");
        return [];
    }
    return rows;
}

// Function to salt and hash raw data passwords

async function saltAndHashPass(raw) {
    const salt = bcrypt.genSaltSync(10);
    const generateHashedPass = bcrypt.hashSync(raw, salt);
    // Return hashed password
    console.log('saltAndHashPass: ', generateHashedPass);
    return generateHashedPass;
}
 
// Compare password against the one stored in the database
async function isPassValid(raw,hashedpass) { 
    return bcrypt.compare(raw, hashedpass);
}

// Async/await wrapper
function asyncWrapper(callback) {
    return function (req, res, next) { 
        callback(req, res, next).catch(next);
    }
}
// Helper function to traverse through the DOM elements
const closest = (to, selector) => {
    let currentElement = document.querySelector(to);
    let returnElement;

    while (currentElement.parentNode && !returnElement) {
        currentElement = currentElement.parentNode;
        returnElement = currentElement.querySelector(selector);
    }

    return returnElement;
}

function returnElementTextContent(elementSelector,childSelector) {
    // ✔️ Outputs the same as .closest
    console.log(closest(elementSelector, childSelector));
    //console.log(closest(elementSelector, '.content'))
    //const fname = document.querySelector('.firstname').textContent;
    //const lname = document.querySelector('.lastname').textContent;
    //const fname = closest(elementSelector,'.firstname').textContent;
    //const lname = closest(elementSelector,'.lastname').textContent;
    // ✔️ Works with elements in any other directions
    //console.log(closest(elementSelector, '.tooltip-backdrop'))
    //console.log(closest(elementSelector, '.cta'))
    //console.log(closest(elementSelector, '.cta-icon'))
    //result.textContent = fname + ' ' + lname;
    //console.log("result.textContent: " + result.textContent)
    return closest(elementSelector,childSelectors);
}




module.exports = {
    getOffset,
    emptyOrRows,
    asyncWrapper,
    saltAndHashPass,
    isPassValid,
    returnElementTextContent,
}