import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
    AppConfig: a.model({
      toxicTileProbability: a.float(),
      maxTurns: a.integer(),
      previewTileCount: a.integer(),
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