```javascript
(function () {
    'use strict';

    var PLUGIN_NAME = 'KinoGo';

    console.log('[KinoGo] loading');


    /*
     * ============================================================
     * KINOGO COMPONENT
     * ============================================================
     */

    function KinoGoComponent(object) {

        var self = this;

        this.object = object || {};

        this.movie = this.object.movie || {};

        this.html = null;


        /*
         * --------------------------------------------------------
         * CREATE
         * --------------------------------------------------------
         *
         * Lampa передаёт сюда контейнер activity.
         */

        this.create = function (body) {

            var title =
                self.movie.title ||
                self.movie.original_title ||
                self.movie.name ||
                self.movie.original_name ||
                'Без названия';


            var year = '';


            if (self.movie.release_year) {

                year = String(
                    self.movie.release_year
                );

            }
            else if (self.movie.release_date) {

                year =
                    String(
                        self.movie.release_date
                    ).substring(0, 4);

            }
            else if (self.movie.first_air_date) {

                year =
                    String(
                        self.movie.first_air_date
                    ).substring(0, 4);

            }


            self.html = $(

                '<div class="kinogo-page">' +

                    '<div class="kinogo-page__title">' +
                        'KinoGo' +
                    '</div>' +

                    '<div class="kinogo-page__movie">' +
                        title +
                    '</div>' +

                    '<div class="kinogo-page__year">' +
                        year +
                    '</div>' +

                    '<div class="kinogo-page__status">' +
                        'Плагин работает.' +
                    '</div>' +

                '</div>'

            );


            console.log(
                '[KinoGo] create',
                self.movie
            );

        };


        /*
         * --------------------------------------------------------
         * RENDER
         * --------------------------------------------------------
         *
         * ЭТОГО МЕТОДА НЕ ХВАТАЛО В ПРЕДЫДУЩЕЙ ВЕРСИИ.
         */

        this.render = function () {

            return self.html;

        };


        /*
         * --------------------------------------------------------
         * START
         * --------------------------------------------------------
         */

        this.start = function () {

            console.log(
                '[KinoGo] start'
            );


            console.log(
                '[KinoGo] movie:',
                self.movie
            );

        };


        /*
         * --------------------------------------------------------
         * PAUSE
         * --------------------------------------------------------
         */

        this.pause = function () {

        };


        /*
         * --------------------------------------------------------
         * STOP
         * --------------------------------------------------------
         */

        this.stop = function () {

        };


        /*
         * --------------------------------------------------------
         * DESTROY
         * --------------------------------------------------------
         */

        this.destroy = function () {

            console.log(
                '[KinoGo] destroy'
            );

            self.html = null;

        };

    }


    /*
     * ============================================================
     * REGISTER COMPONENT
     * ============================================================
     */

    Lampa.Component.add(
        'kinogo',
        KinoGoComponent
    );


    console.log(
        '[KinoGo] component registered'
    );


    /*
     * ============================================================
     * OPEN KINOGO
     * ============================================================
     */

    function openKinoGo(movie) {

        console.log(
            '[KinoGo] opening',
            movie
        );


        Lampa.Activity.push({

            url: '',

            title: PLUGIN_NAME,

            component: 'kinogo',

            movie: movie,

            page: 1

        });

    }


    /*
     * ============================================================
     * ADD BUTTON TO FULL CARD
     * ============================================================
     */

    function addButton(e) {

        var render =
            e.object.activity.render();


        /*
         * Уже добавлена?
         */

        if (
            render.find(
                '.kinogo--button'
            ).length
        ) {

            return;

        }


        /*
         * Создаём кнопку.
         */

        var button = $(

            '<div class="' +
                'full-start__button selector kinogo--button' +
            '">' +

                '<svg ' +
                    'viewBox="0 0 24 24" ' +
                    'width="2.4em" ' +
                    'height="2.4em"' +
                '>' +

                    '<circle ' +
                        'cx="12" ' +
                        'cy="12" ' +
                        'r="9" ' +
                        'fill="none" ' +
                        'stroke="currentColor" ' +
                        'stroke-width="2"' +
                    '/>' +

                    '<path ' +
                        'd="M10 8 L16 12 L10 16 Z" ' +
                        'fill="currentColor"' +
                    '/>' +

                '</svg>' +

            '</div>'

        );


        /*
         * Нажатие.
         */

        button.on(
            'hover:enter',

            function () {

                console.log(
                    '[KinoGo] button pressed'
                );


                openKinoGo(
                    e.data.movie
                );

            }

        );


        /*
         * Вставляем после кнопки торрентов.
         */

        var torrent =
            render.find(
                '.view--torrent'
            );


        if (torrent.length) {

            torrent.after(
                button
            );

            console.log(
                '[KinoGo] button added after torrent'
            );

        }
        else {

            /*
             * Если torrent-кнопки нет,
             * добавляем в контейнер кнопок.
             */

            var buttons =
                render.find(
                    '.full-start__buttons'
                );


            if (buttons.length) {

                buttons.append(
                    button
                );

                console.log(
                    '[KinoGo] button added to buttons'
                );

            }
            else {

                console.log(
                    '[KinoGo] buttons container not found'
                );

            }

        }

    }


    /*
     * ============================================================
     * FULL CARD EVENT
     * ============================================================
     */

    Lampa.Listener.follow(

        'full',

        function (e) {

            if (
                e.type !== 'complite'
            ) {

                return;

            }


            console.log(
                '[KinoGo] full card loaded'
            );


            addButton(e);

        }

    );


    /*
     * ============================================================
     * CSS
     * ============================================================
     */

    if (
        !document.getElementById(
            'kinogo-css'
        )
    ) {

        var style =
            document.createElement(
                'style'
            );


        style.id =
            'kinogo-css';


        style.textContent = `

            .kinogo-page {
                padding: 2em;
                box-sizing: border-box;
                min-height: 100%;
            }

            .kinogo-page__title {
                font-size: 2em;
                font-weight: 600;
                margin-bottom: 1em;
            }

            .kinogo-page__movie {
                font-size: 1.5em;
                margin-bottom: .4em;
            }

            .kinogo-page__year {
                opacity: .6;
                margin-bottom: 2em;
            }

            .kinogo-page__status {
                opacity: .7;
            }

            .kinogo--button {
                display: flex;
                align-items: center;
                justify-content: center;
            }

        `;


        document.head.appendChild(
            style
        );

    }


    console.log(
        '[KinoGo] loaded successfully'
    );

})();
```
