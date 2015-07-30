angular.module('angular-toc', []);
angular.module('angular-toc')
.directive('bdToc', function ($timeout, $compile, $rootScope, $state) {

    // Item object.
    var Item = function (el) {
        return {

            // The element we want to make an item.
            $el: angular.element(el),

            // Make a slug out of the text
            slug: function (text) {
                return text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
            },

            // Renders the item.
            render: function () {

                // Get the title.
                var title = this.$el.text();

                // Set the id of the element.
                this.$el.attr('id', this.slug(title));

                // Prepare the markup
                /*var el = '<li du-scrollspy="' + this.slug(title) + '">' +
                            '<a href="#' + this.slug(title) + '" offset="60">' + title + '</a>' +
                        '</li>';
*/

                var el = '<li>' +
                    '<a href="#' + $state.$current.url.prefix + '#' + this.slug(title) + '">' + title + '</a>' +
                    '</li>';

                // Return the finished element.
                return el;
            }
        };
    };

    return {
        // Can only be created as an element: <bd-toc></bd-toc>
        restrict: 'E',
        link: function (scope, elem, attrs) {
            // Wrapped in a timeout (of 0) to wait for things like ngShow to resolve
            $timeout(function() {
                // Set the selector that will be used, default to .toc-item
                var selector = attrs.selector || '.toc-item';

                // Get the elements based on the selector
                var els = document.querySelectorAll(selector);

                elem.append('<ul class="" />');

                // Loop over the selected elements.
                angular.forEach(els, function (el){
                    // Append a list item.
                    if(el.offsetHeight > 0) {
                        elem.find('ul').append($compile(new Item(el).render())( scope ));
                    }
                });
            });

            // Update the TOC when the event is broadcast
            $rootScope.$on('bdTocUpdate', function() {
                $timeout(function() {
                    if(!elem) {
                        return;
                    }

                    // Set the selector that will be used, default to .toc-item
                    var selector = attrs.selector || '.toc-item';

                    // Get the elements based on the selector
                    var els = document.querySelectorAll(selector);

                    // Loop over the selected elements.
                    angular.forEach(els, function (el){
                        // Append a list item.
                        if(el.offsetHeight > 0) {
                            elem.find('ul').append($compile(new Item(el).render())( scope ));
                        }
                    });

                    // Only add back to top if there are tags present
                    if(els.length > 0) {
                        // Back to top link
                        var b2t = '<li>' +
                                    '<a href="" bd-toc-scroll-top class="back-to-top">' +
                                        'back to top <i class="fa fa-chevron-up"></i>' +
                                    '</a>' +
                                  '</li>';

                        elem.find('ul').append($compile(b2t)(scope));
                    }
                });
            });

            // Remove the existing directive because it will be rebuilt later
            scope.$on('$destroy', function() {
                elem = null;
            });
        }
    };
});
