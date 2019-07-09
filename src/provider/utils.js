
import { convert } from 'xml-js';

export function parseXML(xml) {

    const converted = convert.xml2json(xml, {
        compact: true,
        spaces: 4
    });
    return JSON.parse(converted);
}