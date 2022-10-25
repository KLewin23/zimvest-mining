import { IoMdOptions } from 'react-icons/io';
import { FaBolt, FaCogs, FaEnvira, FaHive, FaSnowplow } from 'react-icons/fa';
import { ItemSelectorTab } from './types';

export const metals = [
    'Gold',
    'Silver',
    'Platinum',
    'Palladium',
    'Rhodium',
    'Copper',
    'Lead',
    'Tin',
    'Nickel',
    'Zinc',
    'Iron',
    'Chromium',
    'Other',
];

export const serviceExtendedSidebarLayout: ItemSelectorTab[] = [
    {
        title: 'Type',
        icon: IoMdOptions,
        subList: [
            'Mining Contractors',
            'Chemical Providers',
            'Logistics',
            'Lab and Testing',
            'Telecommunication',
            'Banking and Insurance',
            'Screening Equipment',
            'Mining Events Companies',
        ],
        tabDefaultState: true,
    },
];

export const productExtendedSidebarLayout: ItemSelectorTab[] = [
    {
        title: 'Machinery',
        icon: FaSnowplow,
        subList: ['Mining Drills', 'Blasting Tools', 'Earth Movers', 'Crushing Equipment', 'Screening Equipment'],
        tabDefaultState: true,
    },
    {
        title: 'Consumables',
        icon: FaCogs,
        subList: [
            'Bearings',
            'Idler Rollers',
            'Conveyors',
            'Drill bits',
            'Mining Horse',
            'Valves',
            'PPE',
            'Spare Parts',
            'Cable Hooks',
            'Other Service Providers',
        ],
        tabDefaultState: true,
    },
    {
        title: 'Services',
        icon: FaBolt,
        subList: [
            'Mining Contractors',
            'Chemical Providers',
            'Logistics',
            'Lab Testing Services',
            'Telecommunications',
            'Banking and Insurance',
            'Screening Equipment',
            'Mining Equipment',
        ],
        tabDefaultState: false,
    },
    {
        title: 'Metals',
        icon: FaHive,
        subList: ['Base Metals', 'Precious Metals', 'Minor Metals', 'Bulk Metals', 'Semi Precious Stones', 'Ferro Alloys', 'Rare Earth'],
        tabDefaultState: false,
    },
    {
        title: 'Fertilizers',
        icon: FaEnvira,
        subList: ['Phosphate', 'Potash', 'Nitrogen', 'DAP', 'Map', 'SSP', 'TSP', 'Urea'],
        tabDefaultState: false,
    },
];

export const metalsMap = {
    XAU: 'Gold',
    XAG: 'Silver',
    XPT: 'Platinum',
    XPD: 'Palladium',
    XCU: 'Copper',
    XRH: 'Rhodium',
    RUTH: 'Ruthenium',
    ALU: 'Aluminium',
    NI: 'Nickel',
    ZNC: 'Zinc',
    TIN: 'Tin',
    LCO: 'Cobalt',
    IRD: 'Iridium',
    LEAD: 'Lead',
    IRON: 'Iron',
    URANIUM: 'Uranium',
    MS: 'Magnesium',
    OSMIUM: 'Osmium',
    RHENIUM: 'Rhenium',
    INDIUM: 'Indium',
    MO: 'Molybdenum',
    TUNGSTEN: 'Tungsten',
    LITHIUM: 'Lithium',
    GALLIUM: 'Gallium',
    MN: 'Manganese',
    ND: 'Neodymium',
    TE: 'Tellurium',
};
