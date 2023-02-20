import { useState, useEffect } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import { client } from "../apollo-client";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import {
  REPORTS_SUBSCRIPTION,
  REPORTS_UPDATE_SUBSCRIPTION,
} from "graphql/subscriptions";
import {
  BLOCK_REPORT_MUTATION,
  RESOLVE_REPORT_MUTATION,
} from "graphql/mutations";
import { gql } from "@apollo/client";

export default function Index({ data: initData }: any) {
  const [blockReportMutation, { loading: blockLoading }] = useMutation(
    BLOCK_REPORT_MUTATION
  );
  const [resolveReportMutation, { loading: resolveLoading }] = useMutation(
    RESOLVE_REPORT_MUTATION
  );

  const { data: reportsData, loading: reportsLoading } = useSubscription(
    REPORTS_SUBSCRIPTION,
    {
      variables: { from: 10 },
    }
  );

  const { data: reportUpdateData } = useSubscription(
    REPORTS_UPDATE_SUBSCRIPTION,
    {
      variables: { from: 10 },
    }
  );

  // store the data in state
  const [reports, setReports] = useState(initData.reports);

  useEffect(() => {
    const handleReportsEffect = () => {
      if (reportsData) {
        setReports([...reports, { ...reportsData.broadcastReports }]);
      }
    };

    return handleReportsEffect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportsData]);

  useEffect(() => {
    const handleReportUpdateEffect = () => {
      if (reportUpdateData) {
        const updateData = reportUpdateData.updateReport;
        const reportIndex = reports.findIndex(
          (report: any) => report.id === updateData.id
        );
        const updatedReports = [...reports];

        switch (updateData.state) {
          case "BLOCKED": {
            // update report state
            updatedReports[reportIndex].state = updateData.state;
            setReports(updatedReports);
            break;
          }

          case "RESOLVED":
          default:
            {
              const reportIndex = reports.findIndex(
                (report: any) => report.id === updateData.id
              );
              const updatedReports = [...reports];
              // remove from reports
              updatedReports.splice(reportIndex, 1);
              setReports(updatedReports);
            }

            break;
        }
      }
    };

    return handleReportUpdateEffect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportUpdateData]);

  const handleBlock = async (id: string) => {
    // use mutation to block user
    const result = await blockReportMutation({
      variables: {
        id,
      },
    });

    if (result && result.data.blockReport) {
      return;
    }

    // handle ui error
  };

  const handleResolve = async (id: string) => {
    // use mutation to resolve report
    const result = await resolveReportMutation({
      variables: {
        id,
      },
    });

    if (result && result.data.resolveReport) {
      return;
    }

    // handle ui error
  };

  return (
    <Box
      w="100%"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      px={{ base: "10px", md: "50px", lg: "150px" }}
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
        {reports.map((report: any) => (
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
                  <Text fontSize={{ base: "11px", md: "16px" }}>
                    Id: {report.id}
                  </Text>
                </Flex>
                {report.payload.message && (
                  <Flex
                    w="100%"
                    flexWrap="wrap"
                    alignItems="center"
                    justifyContent="start"
                    backgroundColor="lightgrey"
                    padding="5px"
                    borderRadius="5px"
                    minH="30px"
                    mt="15px"
                  >
                    <Text>{report.payload.message}</Text>
                  </Flex>
                )}
              </Flex>
              <Flex w="40%">
                <Flex w="100%" flexWrap="wrap" alignItems="center">
                  <Flex w="100%" justifyContent="end" mt="15px">
                    <Button
                      colorScheme="red"
                      isDisabled={report.state === "BLOCKED"}
                      // isLoading={blockLoading}
                      onClick={() => handleBlock(report.id)}
                    >
                      Block
                    </Button>
                  </Flex>
                  <Flex w="100%" justifyContent="end" mt="15px">
                    <Button
                      onClick={() => handleResolve(report.id)}
                      colorScheme="teal"
                      // isLoading={resolveLoading}
                    >
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
