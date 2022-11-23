import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { ChainId } from "@qidao/sdk";
import { getUnixTime } from "date-fns/fp";

interface BlockFinderQueryResult {
  blocks: {
    network: string;
    number: number;
  }[];
}

export const blockfinderClient = new ApolloClient({
  link: createHttpLink({
    uri: "https://blockfinder.snapshot.org/graphql?",
  }),
  cache: new InMemoryCache(),
});

export const getBlockNumbersFromTS = async (
  timestamp: Date | number,
  chainId: ChainId
) => {
  //"10", "25", "100", "137", "250", "1285", "42161", "43114", "1666600000"
  const ts = timestamp instanceof Date ? getUnixTime(timestamp) : timestamp;
  return await blockfinderClient.query<BlockFinderQueryResult>({
    query: gql`
      query blockTimestamp($ts: Int!, $chainId: String!) {
        blocks(where: { ts: $ts, network_in: [$chainId] }) {
          network
          number
        }
      }
    `,
    variables: {
      ts,
      chainId: chainId.toString(),
    },
  });
};
