import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

// {
//   rows: 25,
//   cols: 25,
//   hexSize: 50,
//   maxToxicTilesPerGame: 3,
//   toxicTileProbability: 0.1,
//   maxTurns: 20,
//   previewTileCount: 3,
//   questProbability: 0.2,
//   maxQuestsPerGame: 3,
//   perTurnResourceProduction: false,
//   actionPrices: {
//     rotate: {
//       wood: 0,
//       stone: 1,
//       food: 0,
//       gold: 1,
//     },
//     changeUpcomingHex: {
//       wood: 1,
//       stone: 0,
//       food: 1,
//       gold: 0,
//     },
//     redrawUpcomingHexes: {
//       wood: 1,
//       stone: 1,
//       food: 1,
//       gold: 1,
//     },
//   },
// }#3f3937

const schema = a.schema({
    AppConfig: a.model({
      rows: a.integer(),
      cols: a.integer(),
      hexSize: a.integer(),
      maxToxicTilesPerGame: a.integer(),
      toxicTileProbability: a.float(),
      maxTurns: a.integer(),
      previewTileCount: a.integer(),
      questProbability: a.float(),
      maxQuestsPerGame: a.integer(),
      perTurnResourceProduction: a.boolean(),
      actionPrices: a.customType({
        rotate: a.customType({
          wood: a.integer(),
          stone: a.integer(),
          food: a.integer(),
          gold: a.integer(),
        }),
        changeUpcomingHex: a.customType({
          wood: a.integer(),
          stone: a.integer(),
          food: a.integer(),
          gold: a.integer(),
        }),
        redrawUpcomingHexes: a.customType({
          wood: a.integer(),
          stone: a.integer(),
          food: a.integer(),
          gold: a.integer(),
        }),
      }),
    }).authorization(allow => [allow.publicApiKey().to(['get', 'list', 'listen'])])
  });

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});