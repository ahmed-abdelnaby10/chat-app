import { Provider } from 'react-redux'
import { persistor, store } from '../rtk/index'
import { PersistGate } from 'redux-persist/integration/react'
import PropTypes from 'prop-types'

export default function StoreProvider({ children }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}

StoreProvider.propTypes = {
    children: PropTypes.node.isRequired,
};