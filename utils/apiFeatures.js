class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[queryObj]);

    let strObj = JSON.stringify(queryObj);
    strObj = strObj.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(strObj));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const criteria = this.queryString.sort.split(",").join();
      this.query = this.query.sort(criteria);
    } else {
      this.query = this.query.sort("-creatAt");
    }

    return this;
  }
}

module.exports = APIFeatures;
