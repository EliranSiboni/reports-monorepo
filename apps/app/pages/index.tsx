import { useState, useEffect } from "react";
import { useSubscription } from "@apollo/client";
import { client } from "../apollo-client";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { REPORTS_SUBSCRIPTION } from "graphql/subscriptions";

export default function Index({ data: initData }: any) {
  const { data, loading } = useSubscription(REPORTS_SUBSCRIPTION, {
    variables: { from: 10 },
  });
  // store the data in state
  const [reports, setReports] = useState(initData);

  useEffect(() => {
    const handleReportsEffect = () => {
      if (data) {
        setReports((prev: any) => ({
          ...prev,
          reports: [...reports, data.broadcastReports],
        }));
      }
    };

    return handleReportsEffect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleBlock = (id: string) => {};

  const handleResolve = (id: string) => {};

  return (
    <Box
      w="100%"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      px="150px"
      pt="100px"
    >
      <Box
        w="100%"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        fontWeight="bold"
      >
        <h1>Spam Reports</h1>
      </Box>
      <Flex
        w="100%"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        flexWrap="wrap"
      >
        {reports.reports.map((report: any) => (
          <Flex
            key={report.id}
            w="100%"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            flexWrap="wrap"
            margin="15px"
            border="1px solid #000"
            borderRadius="10px"
            maxW={{ base: "100%", md: "50%", lg: "100%" }}
            height="200px"
            p="20px"
          >
            <Flex justify="space-between" w={{ base: "100%" }}>
              <Text>State: {report.state}</Text>
              <Text>Type: {report.payload.reportType}</Text>
            </Flex>
            <Flex w="100%" justify="space-between" alignItems="center">
              <Flex w="60%" flexWrap="wrap">
                <Flex
                  w="100%"
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="start"
                >
                  <Text>Id: {report.id}</Text>
                </Flex>
                <Flex
                  w="100%"
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="start"
                >
                  {report.payload.message && (
                    <Text>{report.payload.message}</Text>
                  )}
                </Flex>
              </Flex>
              <Flex w="40%">
                <Flex w="100%" flexWrap="wrap" alignItems="center">
                  <Flex w="100%" justifyContent="end" mt="15px">
                    <Button onClick={() => handleBlock(report.id)}>
                      Block
                    </Button>
                  </Flex>
                  <Flex w="100%" justifyContent="end" mt="15px">
                    <Button onClick={() => handleResolve(report.id)}>
                      Resolve
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query reports {
        reports {
          id
          state
          payload {
            reportType
            message
          }
        }
      }
    `,
  });

  return {
    props: {
      data,
    },
  };
}
