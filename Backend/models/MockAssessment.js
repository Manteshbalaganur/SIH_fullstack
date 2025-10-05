// Temporary mock database for testing
let assessments = [];
let idCounter = 1;

class MockAssessment {
  constructor(data) {
    this._id = idCounter++;
    this.user_id = data.user_id;
    this.metal_type = data.metal_type;
    this.production_volume = data.production_volume;
    this.circularity_score = Math.floor(Math.random() * 100);
    this.timestamp = new Date();
    Object.assign(this, data);
  }

  save() {
    assessments.push(this);
    return Promise.resolve(this);
  }

  static find(query) {
    let results = assessments;
    if (query.user_id) {
      results = results.filter(a => a.user_id === query.user_id);
    }
    return Promise.resolve(results.sort((a, b) => b.timestamp - a.timestamp));
  }

  static findById(id) {
    const assessment = assessments.find(a => a._id == id);
    return Promise.resolve(assessment);
  }
}

module.exports = MockAssessment;