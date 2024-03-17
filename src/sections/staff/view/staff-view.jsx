// import PropTypes from 'prop-types';

import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useQuery, useQueries } from '@tanstack/react-query';

import { Box, Stack, Divider, Typography } from '@mui/material';

import Image from 'src/components/image';
import { useAuthContext } from 'src/auth/hooks';
import TableOrder from 'src/sections/staff/table-order';
import FoodMenu from 'src/sections/staff/food-menu/food-menu';
import TableActionBar from 'src/sections/staff/table-action-bar';
import { useStaffContext } from 'src/sections/staff/context/staff-context';
import TableOrderSkeleton from 'src/sections/staff/skeleton/table-order-skeleton';

function StaffView() {
  const { userID } = useParams();
  const { fsGetSectionMeals, fsGetSections, activeOrders, staff, menuSections, fsGetMeal } =
    useAuthContext();
  const { selectedTable: tableInfo, isLoading } = useStaffContext();

  const selectedTableOrder = activeOrders.find((order) => order.tableID === tableInfo.docID);

  const { data: sectionsUnsubscribe = () => {} } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: tableInfo.menuID ? ['sections', userID, tableInfo.menuID] : null,
    queryFn: () => fsGetSections(tableInfo.menuID, userID),
    enabled: tableInfo?.docID !== undefined,
  });

  useEffect(
    () => () => {
      if (typeof sectionsUnsubscribe === 'function') {
        sectionsUnsubscribe();
      }
    },
    [sectionsUnsubscribe]
  );

  useQueries({
    queries: menuSections.flatMap((section) =>
      section.meals.map((meal) => ({
        queryKey: ['meal', meal.mealID],
        queryFn: () => fsGetMeal(meal.mealID, '200x200'),
      }))
    ),
  });

  // useQueries({
  //   queries: menuSections.map((section) => ({
  //     queryKey: ['sectionMeals', userID, section.docID],
  //     queryFn: () =>
  //       fsGetSectionMeals(
  //         userID,
  //         section.meals.flatMap((meal) => meal.mealID),
  //         '200x200'
  //       ),
  //     enabled: menuSections.length !== 0,
  //   })),
  // });

  if (isLoading) return <TableOrderSkeleton />;

  if (!tableInfo?.docID && activeOrders.length === 0)
    return (
      <Box
        sx={{
          display: 'flex',
          m: 'auto',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.paper',
          p: 3,
          gap: 2,
          borderRadius: 3,
          boxShadow: '3px 3px 0 0 #000',
          border: 'solid 3px #000',
        }}
      >
        <Image src="/assets/icons/staff/coffee-love-icon.svg" sx={{ width: 250, height: 250 }} />
        <Typography variant="h4">All Looks Good, take a break!!</Typography>
      </Box>
    );

  return (
    tableInfo?.docID &&
    menuSections.length !== 0 &&
    selectedTableOrder &&
    !selectedTableOrder?.isCanceled &&
    !selectedTableOrder?.isPaid && (
      <Stack
        direction="row"
        spacing={3}
        sx={{ py: 2 }}
        divider={<Divider sx={{ borderStyle: 'dashed' }} flexItem orientation="vertical" />}
      >
        <Stack direction="column" spacing={2} sx={{ width: '50%' }}>
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
          {staff?.type === 'waiter' && <TableActionBar />}
          <TableOrder />
        </Stack>
        <Box flexGrow={1} sx={{ maxWidth: '50%' }}>
          <FoodMenu sections={menuSections} />
        </Box>
      </Stack>
    )
  );
}
export default StaffView;
// StaffView.propTypes = { tables: PropTypes.array };
