import {useSelector} from 'react-redux';

export const useCurrencySelector = () => {
  return useSelector(state => state.common.currency_symbol);
};

export const useLoaderSelector = () => {
  const {loading, loadingRequest, showLoader} = useSelector(
    state => state.common,
  );

  return {loading, loadingRequest, showLoader};
};

export const useProfileSelector = () => {
  return useSelector(state => state.profile.profileData);
};

// earning selector

// loading: false,
//     loadingRequest: "",
//     showloader: true
