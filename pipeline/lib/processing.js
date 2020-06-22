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

module.exports = {
  processProfessionals,
  processTeam
};
