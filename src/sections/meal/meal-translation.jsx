import { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Grid, Card, Stack, Tooltip, Typography, IconButton, CardHeader } from '@mui/material';

import Iconify from 'src/components/iconify';
import { LANGUAGE_CODES } from 'src/locales/languageCodes';
import LanguageCard from 'src/components/translation-cards/LanguageCard';
import DialogEditTitle from 'src/components/translation-cards/DialogEditTitle';

MealTranslation.propTypes = { mealInfo: PropTypes.object };

export default function MealTranslation({ mealInfo }) {
  const languageKeys = Object.keys(mealInfo.translationEdited || {});
  const [isOpenModal, setIsOpenModal] = useState(false);

  const closeModal = () => {
    setIsOpenModal(false);
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={12}>
        <Stack spacing={3}>
          <Card>
            <CardHeader
              title={mealInfo.title}
              action={
                <Tooltip title="Edit">
                  <IconButton color="secondary" size="small" onClick={() => setIsOpenModal(true)}>
                    <Iconify icon="clarity:edit-line" width={24} height={24} />
                  </IconButton>
                </Tooltip>
              }
            />
            <Box sx={{ p: 3, pt: 1 }}>
              <Typography>{mealInfo.description}</Typography>
            </Box>
          </Card>

          {languageKeys
            .sort((a, b) => LANGUAGE_CODES[a].localeCompare(LANGUAGE_CODES[b]))
            .map((key) => (
              <LanguageCard languageKey={key} key={key} data={mealInfo} />
            ))}
        </Stack>
      </Grid>

      {isOpenModal && (
        <DialogEditTitle isOpen={isOpenModal} onClose={closeModal} data={mealInfo} showTitle />
      )}
    </Grid>
  );
}
