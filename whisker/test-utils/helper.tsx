import React, { ReactElement } from 'react';
import {
    render,
    renderHook,
    RenderHookResult,
    RenderOptions,
    within,
} from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../src/theme';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const queryClientProvider = ({ children }: any) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export const renderHookWithQueryClient = (hook: () => unknown) =>
    renderHook(hook, { wrapper: queryClientProvider });

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: Providers, ...options });

export const renderWithRouter = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'> & {
        routes: string[];
    },
) =>
    customRender(
        <MemoryRouter initialEntries={options?.routes}>{ui}</MemoryRouter>,
        options,
    );

export const renderHookWithRouter = <Result, Props>(
    render: (initialProps: Props) => Result,
    {
        routes,
    }: {
        routes: string[];
    },
): RenderHookResult<Result, Props> =>
    renderHook(render, {
        wrapper: ({ children }: any) => (
            <MemoryRouter initialEntries={routes}>{children}</MemoryRouter>
        ),
    });

export * from '@testing-library/react';

export { customRender as render, within };
