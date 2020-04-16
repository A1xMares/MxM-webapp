import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

const fanimate = ' cubic-bezier(0.250, 0.460, 0.450, 0.940)';

/* FADEIN TOP */
const ftStle = { transform: 'translateY(-25px)', opacity: 0 };
export const fadeInTop = [
    trigger('fInT1', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [ style(ftStle), animate('.4s .1s' + fanimate) ])
    ]),
    trigger('fInT2', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [ style(ftStle), animate('.4s .2s' + fanimate) ])
    ]),
    trigger('fInT3', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [ style(ftStle), animate('.4s .3s' + fanimate) ])
    ]),
];

/* FADEIN BOTTOM */
const fbStle = { transform: 'translateY(25px)', opacity: 0 };
export const fadeInBottom = [
    trigger('fInB1', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [ style(fbStle), animate('.4s .3s' + fanimate) ]),
    ]),
    trigger('fInB2', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [ style(fbStle), animate('.4s .4s' + fanimate) ]),
    ]),
    trigger('fInB3', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [ style(fbStle), animate('.4s .5s' + fanimate) ]),
    ]),
    trigger('fInB4', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [ style(fbStle), animate('.4s .6s' + fanimate) ]),
    ]),
    trigger('fInB5', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [ style(fbStle), animate('.4s .7s' + fanimate) ]),
    ]),
    trigger('fInB6', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [ style(fbStle), animate('.4s .8s' + fanimate) ]),
    ]),
    trigger('fInB7', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [ style(fbStle), animate('.4s .9s' + fanimate) ]),
    ]),
    trigger('fInB8', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [ style(fbStle), animate('.4s 1s' + fanimate) ]),
    ]),
    trigger('fInB9', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [ style(fbStle), animate('.4s 1.1s' + fanimate) ]),
    ]),
    trigger('fInB10', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [ style(fbStle), animate('.4s 1.2s' + fanimate) ]),
    ]),
];

/* FADEIN RIGHT */
export const fadeInRight = [
    trigger('fInR', [
        state('in', style({ transform: 'translateY(0)', opacity: 1 })),
        transition(':enter', [
            style({transform: 'translateX(-25px)', opacity: 0}),
            animate('.4s' + fanimate)
        ])
    ]),
];

/* FADEIN */
export const fadeIn = [
    trigger('fadeIn', [
        state('in', style({ opacity: 1 })),
        transition(':enter', [ style({ opacity: 0 }), animate('.8s .1s' + fanimate) ])
    ]),
];


/* SLIDE RIGHT */
export const sideMenu = [
    trigger('sideMenu', [
        state('short', style({ transform: 'translateX(0)' })),
        state('large', style({ transform: 'translateX(120px)' })),
        transition('short => large', [ animate('.3s ease-out') ]),
        transition('large => short', [ animate('.3s ease-out') ])
    ]),
];

/* TABLE ROW EXPAND */
export const detailExpand = [
    trigger('detailExpand', [
        state('collapsed', style({ display: 'none' })),
        state('expanded', style({ height: '*', display: 'block' })),
        transition('collapsed => expanded', [ animate('.4s' + fanimate) ]),
        transition('expanded => collapsed', [ animate('.4s' + fanimate) ]),
    ]),
];

export const tableRow = [
    trigger('tableRow', [
        state('left', style({ transform: 'translateX(0)' })),
        state('right', style({ transform: 'translateX(0)' })),
        transition('void => left', [ style({ transform: 'translateX(100%)', opacity: 0 }), animate('.45s ' + fanimate) ]),
        transition('void => right', [ style({ transform: 'translateX(-100%)', opacity: 0 }), animate('.45s ' + fanimate) ]),
    ]),
];

/*export const fadeIn = [
    trigger('fIn', [
        state('in', style({ opacity: 1 })),
        transition(':enter', [ style({ opacity: 0 }), animate('.5s' + fanimate) ])
    ])
];*/

