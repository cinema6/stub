(function($window){
    'use strict';
    $window.__C6_APP_BASE_URL__ = '/base/app/assets';
    
    $window.c6Mocks = {};

    $window.c6Mocks.playList = {
        tree :  {
            name : 'videoA',
            branches : [
                { name : 'videoB', branches : [ 
                    { name : 'videoC', branches : [] } 
                ]},
                { name : 'videoC', branches : [] },
                { name : 'videoD', branches : [
                    { name : 'videoB', branches : [ 
                        { name : 'videoC', branches : [] } 
                    ]},
                    { name : 'videoC', branches : [] }
                ]}
            ]
        },
        data : {
            videoA: {
                src: [  { type: 'video/webm', src: 'media/videoA.webm' },
                        { type: 'video/mp4',  src: 'media/videoA.mp4' } ]
            },
            videoB: {
                src: [  { type: 'video/webm', src: 'media/videoB.webm' },
                        { type: 'video/mp4',  src: 'media/videoB.mp4' } ]
            },
            videoC: {
                src: [  { type: 'video/webm', src: 'media/videoC.webm' },
                        { type: 'video/mp4',  src: 'media/videoC.mp4' } ]
            },
            videoD: {
                src: [  { type: 'video/webm', src: 'media/videoD.webm' },
                        { type: 'video/mp4',  src: 'media/videoD.mp4' } ]
            }
        }
    };

}(window)); 
