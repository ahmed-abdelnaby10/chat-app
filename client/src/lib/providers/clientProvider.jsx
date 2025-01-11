import PropTypes from "prop-types";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient()

export function ClientProvider({
    children
}) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

ClientProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
