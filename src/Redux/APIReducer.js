import OGSApi from '../OGSApi/OGSApi';

export const OVERRIDE_API = "OVERRIDE_API";

const reducer = (state = OGSApi, { type, payload }) => type === OVERRIDE_API ? payload : state;

export default reducer;