'use strict';

const Models = require('../models');

class MovesRepository {

  async createEmptyMove(name) {
    return await Models.moves.create({ name, type: 'N/A' });
  }

  async getMoves() {
    let namesWithoutKeys = [];
    const names = await Models.moves.findAll({
      attributes: ['name'],
      raw: true
    });

    names.forEach(name => {
      namesWithoutKeys.push(name.name);
    });

    return namesWithoutKeys;
  }

  static create() {
    return new MovesRepository();
  }

}

module.exports = MovesRepository;
