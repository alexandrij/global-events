import { Subject } from './observable';

const eventObject = new Subject();

/**
 * Возвращает функцию добавления подписчика
 */
export const useSubscribe = () => eventObject.subscribe.bind(eventObject);

/**
 * Возвращает функцию генерация событий
 */
export const useDispatchEvent = () => eventObject.dispatch.bind(eventObject);

/**
 * Возвращает функцию получения глобального объекта событий
 */
export const useEventObject = () => eventObject;
