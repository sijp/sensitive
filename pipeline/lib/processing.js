function processProfessionals(rows) {
  const columns = rows[0];
  const indexOfCities = columns.indexOf("cities");
  const indexOfServices = columns.indexOf("services");
  return rows.slice(1).map((row) => ({
    ...columns.slice(0, indexOfCities).reduce(
      (memo, column, index) => ({
        ...memo,
        [column]: row[index] === "TRUE" ? true : row[index] || undefined
      }),
      {}
    ),
    cities: row
      .slice(indexOfCities, indexOfServices)
      .map((value, index) =>
        value === "TRUE" ? columns[indexOfCities + index] : undefined
      )
      .filter((value) => value),
    services: row
      .slice(indexOfServices)
      .map((value, index) =>
        value === "TRUE" ? columns[indexOfServices + index] : undefined
      )
      .filter((value) => value)
  }));
}

function processTeam(rows) {
  const columns = rows[0];
  return rows.slice(1).map((row) =>
    columns.reduce(
      (memo, column, index) => ({
        ...memo,
        [column]: row[index]
      }),
      {}
    )
  );
}

function processDocs(docs) {
  const buildCategories = (docsTree) =>
    docsTree.map((doc) => {
      if (doc.folder && doc.docs) {
        return {
          text: doc.folder.name,
          articles: buildCategories(doc.docs)
        };
      }
      return doc.internalId;
    });
  const buildMapping = (docTree) =>
    docTree.reduce((mappings, doc) => {
      if (doc.folder && doc.docs)
        return { ...mappings, ...buildMapping(doc.docs) };
      const metadata = {
        text: doc.name,
        id: doc.internalId,
        resource: doc.description
      };
      return {
        ...mappings,
        [doc.name]: metadata,
        ...(doc.description ? { [doc.description]: metadata } : {})
      };
    }, {});

  return {
    categories: buildCategories(docs),
    mapping: buildMapping(docs)
  };
}

module.exports = {
  processProfessionals,
  processTeam,
  processDocs
};
