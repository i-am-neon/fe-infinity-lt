export type SongMetadata = {
  songName: string;
  feel: string;
  instrumentsUsed: string;
  situationUsedInGame: string;
};

export type SongListWithLinks = Array<
  SongMetadata & {
    youTubeLink: string;
  }
>;
