// import PropTypes from 'prop-types';

import { useParams } from 'react-router';
import { useQuery, useQueries } from '@tanstack/react-query';

import { Box, Stack, Divider, Typography } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import TableOrder from 'src/sections/waiter/table-order';
import FoodMenu from 'src/sections/waiter/food-menu/food-menu';
import TableActionBar from 'src/sections/waiter/table-action-bar';
import { useWaiterContext } from 'src/sections/waiter/context/waiter-context';
import TableOrderSkeleton from 'src/sections/waiter/skeleton/table-order-skeleton';

function WaiterView() {
  const { userID } = useParams();
  const { fsGetSectionMeals, fsGetSections, activeOrders } = useAuthContext();
  const { selectedTable: tableInfo, isLoading } = useWaiterContext();

  const selectedTableOrder = activeOrders.find((order) => order.tableID === tableInfo.docID);

  const { data: sections = [] } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: tableInfo.menuID ? ['sections', userID, tableInfo.menuID] : null,
    queryFn: () => fsGetSections(tableInfo.menuID, userID),
    enabled: tableInfo?.docID !== undefined,
  });

  useQueries({
    queries: sections.map((section) => ({
      queryKey: ['sectionMeals', userID, section.docID],
      queryFn: () =>
        fsGetSectionMeals(
          userID,
          section.meals.flatMap((meal) => meal.mealID)
        ),
      enabled: sections.length !== 0,
    })),
  });

  if (isLoading) return <TableOrderSkeleton />;

  return (
    tableInfo?.docID &&
    sections.length !== 0 &&
    selectedTableOrder &&
    !selectedTableOrder?.isCanceled &&
    !selectedTableOrder?.isPaid && (
      <Stack
        direction="row"
        spacing={3}
        sx={{ py: 2 }}
        divider={<Divider sx={{ borderStyle: 'dashed' }} flexItem orientation="vertical" />}
      >
        <Stack direction="column" spacing={2} sx={{ width: '55%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="column">
              <Typography variant="overline">Table# {tableInfo?.index}</Typography>
              <Typography variant="caption">{tableInfo.docID}</Typography>
            </Stack>

            <Stack direction="column">
              <Typography variant="overline">Order ID</Typography>
              <Typography variant="caption">{selectedTableOrder?.docID}</Typography>
            </Stack>
          </Stack>
          <TableActionBar />
          <TableOrder />
        </Stack>
        <Box flexGrow={1} sx={{ maxWidth: '45%' }}>
          <FoodMenu />
        </Box>
      </Stack>
    )
  );
}
export default WaiterView;
// WaiterView.propTypes = { tables: PropTypes.array };
