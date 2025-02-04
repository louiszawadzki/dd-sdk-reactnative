import { DdRum } from '../DdRum';
import MockTimeProvider from '../__mocks__/MockTimeProvider';

jest.unmock('../../utils/time-provider/TimeProvider');

describe('DdRum', () => {
    describe('setTimeProvider', () => {
        it('overrides default time provider', async () => {
            const mockTimeProvider = new MockTimeProvider(1000, 2000);
            DdRum.setTimeProvider(mockTimeProvider);

            const timestamp = DdRum['timeProvider'].getTimestamp();
            expect(timestamp.unix).toBe(1000);
            expect(timestamp.reactNative).toBe(2000);
        });
    });
});
