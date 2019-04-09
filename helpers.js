const Handlebars = require('handlebars');
const moment = require('moment');

Handlebars.registerHelper('dateFormat', function (item) {
    const momentItem = moment(item);
    console.log("item is ", item);
    if (momentItem.isValid()) {
        return momentItem.format("MM/DD/YYYY");
    } else {
        return "";
    }
});

Handlebars.registerHelper('computeDist', function (spent, budgeted, total) {
    if (Number(spent) > Number(budgeted)) {
        return total;
    }
    return Math.min(Number(spent)/Number(budgeted), 1) * total;
});

Handlebars.registerHelper('nameCase', function(fName) {
    const lowerName = fName.toLowerCase();
    return lowerName.replace(/^\w/, c => c.toUpperCase());
});

Handlebars.registerHelper('trim', function(text, length) {
    if (text.length <= length + 3) return text;
    return text.substr(0, length) + '...';
});

Handlebars.registerHelper('if_even', function(conditional, options) {
    if((conditional % 2) === 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('if_zero', function(conditional, options) {
    if(conditional === 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
