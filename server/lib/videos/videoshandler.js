'use strict';

const videosRepository = require('../../repositories/videos').create();
const movesRepository = require('../../repositories/moves').create();

class VideosHandler {

  async handle(data) {
    try {
      const hasNewMove = await this._checkForNewMoves(data.moves);
      await videosRepository.createVideo(data);

      return hasNewMove;
    } catch (error) {
      if (error.original.code === '23505') {
        throw Error('This video already exists in the database!');
      }
      throw Error(error);
    }
  }

  async _checkForNewMoves(moves) {
    let hasNewMove = false;
    const moveNames = await movesRepository.getMoves();

    await moves.map((name) => {
      if (moveNames.indexOf(name) === -1) {
        hasNewMove = true;
        return movesRepository.createEmptyMove(name);
      }
    });

    return hasNewMove;
  }

  static create() {
    return new VideosHandler();
  }
}

module.exports = VideosHandler;
