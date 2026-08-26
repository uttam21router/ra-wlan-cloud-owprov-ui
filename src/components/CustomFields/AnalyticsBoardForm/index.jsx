import React from 'react';
import { Box, Button, Center, SimpleGrid } from '@chakra-ui/react';
import { useField } from 'formik';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DeleteButton from 'components/Buttons/DeleteButton';
import NumberField from 'components/FormFields/NumberField';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import ToggleField from 'components/FormFields/ToggleField';
import { useGetVenues } from 'hooks/Network/Venues';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  objName: PropTypes.string.isRequired,
};

const AnalyticsBoardForm = ({ editing, objName }) => {
  const { t } = useTranslation();
  const [{ value: board }, , { setValue: setBoard }] = useField('__BOARD');
  const getVenues = useGetVenues();

  const venueOptions = React.useMemo(() => {
    if (!getVenues.data) return [];
    return getVenues.data.map((v) => ({
      value: v.id,
      label: v.name || v.id,
    }));
  }, [getVenues.data]);

  const handleCreate = () => {
    setBoard({
      name: objName,
      venueId: getVenues.data?.[0]?.id || '',
      venueName: objName,
      venueDescription: '',
      interval: 60,
      retention: 3600 * 24 * 7,
      monitorSubVenues: true,
    });
  };
  const handleDelete = () => setBoard(null);

  if (!board) {
    return (
      <Center my={8}>
        <Button colorScheme="blue" onClick={handleCreate} isDisabled={!editing}>
          {t('analytics.create_board')}
        </Button>
      </Center>
    );
  }

  return (
    <>
      <Box textAlign="right">
        <DeleteButton isDisabled={!editing} onClick={handleDelete} label={t('analytics.stop_monitoring')} />
      </Box>
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <StringField name="__BOARD.name" label={t('common.name')} isDisabled={!editing} isRequired />
        {venueOptions.length > 0 ? (
          <SelectField
            name="__BOARD.venueId"
            label={t('venues.one')}
            options={venueOptions}
            isDisabled={!editing}
            isRequired
          />
        ) : (
          <StringField name="__BOARD.venueId" label={t('venues.one')} isDisabled={!editing} isRequired />
        )}
        <StringField name="__BOARD.venueDescription" label={t('common.description')} isDisabled={!editing} />
        <NumberField
          name="__BOARD.interval"
          label={t('analytics.interval')}
          isDisabled={!editing}
          isRequired
          unit={t('common.seconds')}
        />
        <NumberField
          name="__BOARD.retention"
          label={t('analytics.retention')}
          isDisabled={!editing}
          isRequired
          unit={t('common.days')}
          conversionFactor={3600 * 24}
        />
        <ToggleField name="__BOARD.monitorSubVenues" label={t('analytics.analyze_sub_venues')} isDisabled={!editing} />
      </SimpleGrid>
    </>
  );
};

AnalyticsBoardForm.propTypes = propTypes;

export default React.memo(AnalyticsBoardForm);
