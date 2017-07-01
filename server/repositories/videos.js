'use strict';

const Models = require('../models');
const _ = require('lodash');

class VideosRepository {

  async createVideo(data) {
    data.link = _.get(data, 'link', 'N/A');

    return Models.videos.create(data);
  }

  async getVideoByName(name) {
    return Models.videos.findOne({
      where: { name }
    });
  }

  static create() {
    return new VideosRepository();
  }

}

module.exports = VideosRepository;
