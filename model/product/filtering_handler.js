// filter child function

const fieldChildFilter = async (filter, data) => {
    let { filterCategory } = data;
    if (filter.fieldChild && filter.fieldChild.length > 0) {
        var valuesChild = [];
        for (i = 0; i < filter.fieldChild.length; i++) {
            catField = await filterCategory.findOne({ "language.values.valueChild._id": filter.fieldChild[i] })
            var catFieldLanguageChild = catField && catField.language && catField.language.map((a) => {
                valueChildData = a && a.values && a.values.map((a) => {
                    vC = a && a.valueChild && a.valueChild.map((b) => {
                        return b
                    })
                    return vC
                });
                return valueChildData;
            });
            if (catFieldLanguageChild && catFieldLanguageChild.length > 0) {
                for (z = 0; z < catFieldLanguageChild.length; z++) {
                    for (y = 0; y < catFieldLanguageChild[z].length; y++) {
                        childValues = [];
                        catFieldLanguageChild[z][y].map((x) => {
                            childValues.push(x._id.toString())
                        })
                        if ((childValues.indexOf(filter.fieldChild[i])) >= 0) {
                            var indexValue = y
                            var childIndex = childValues.indexOf(filter.fieldChild[i]);
                        }
                    }
                }
                catFieldLanguageChild.map((j) => {
                    valuesChild.push(j[indexValue][childIndex]._id.toString());
                })
            }
        }
        return valuesChild
    }
}

module.exports = {
    fieldChildFilter
}