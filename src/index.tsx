import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from 'components/App';
import { store } from 'store/store';
import { error } from 'utils/config';
import 'styles/index.scss';

const container = document.getElementById('root');

if (!container) {
    throw new Error(error.noAppRoot);
}

const root = createRoot(container);
const app = (
    <Provider store={store}>
        <App />
    </Provider>
);

root.render(app);
