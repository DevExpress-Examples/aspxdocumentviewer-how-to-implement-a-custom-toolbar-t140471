﻿(function (toolbar) {
    function getControl(toolbarName, name) {
        return ASPx.GetControlCollection().Get(toolbarName + name);
    }

    function initialize(toolbarNames, $documentViewer) {
        var pageCount = 0,
            pageIndex = 0;

        $documentViewer.PageLoad.AddHandler(function (s, e) {
            pageCount = e.PageCount;
            pageIndex = e.PageIndex;
        });

        $(toolbarNames).each(function (_index, toolbarName) {
            var $search = getControl(toolbarName, "Search");
            $search.Click.AddHandler(function () {
                $documentViewer.Search();
            });

            var $print = getControl(toolbarName, "Print");
            $print.Click.AddHandler(function () {
                $documentViewer.Print();
            });

            var $printPage = getControl(toolbarName, "PrintPage");
            $printPage.Click.AddHandler(function () {
                $documentViewer.Print(pageIndex);
            });

            var $firstPage = getControl(toolbarName, "FirstPage");
            $firstPage.Click.AddHandler(function () {
                $documentViewer.GotoPage(0);
            });

            var $prevPage = getControl(toolbarName, "PrevPage");
            $prevPage.Click.AddHandler(function () {
                $documentViewer.GotoPage(pageIndex - 1);
            });

            var $page  = getControl(toolbarName, "Page");
            $page.SelectedIndexChanged.AddHandler(function () {
                $documentViewer.GotoPage($page.GetValue());
            });

            var $pageCount = getControl(toolbarName, "PageCount");

            var $nextPage = getControl(toolbarName, "NextPage");
            $nextPage.Click.AddHandler(function () {
                $documentViewer.GotoPage(pageIndex + 1);
            });

            var $lastPage = getControl(toolbarName, "LastPage");
            $lastPage.Click.AddHandler(function () {
                $documentViewer.GotoPage(pageCount - 1);
            });

            var $exportFormat = getControl(toolbarName, "ExportFormat");

            var $save = getControl(toolbarName, "Save");
            $save.Click.AddHandler(function () {
                $documentViewer.SaveToDisk($exportFormat.GetValue());
            });

            var $saveToWindow = getControl(toolbarName, "SaveWindow");
            $saveToWindow.Click.AddHandler(function () {
                $documentViewer.SaveToWindow($exportFormat.GetValue());
            });

            function updatePageIndexes(pageCount, pageIndex) {
                if (pageCount !== $page.GetItemCount()) {
                    $page.BeginUpdate();
                    $page.ClearItems();
                    for (var i = 0; i < pageCount; i++) {
                        $page.AddItem((i + 1).toString(), i);
                    }
                    $page.EndUpdate();
                }
                $page.SetSelectedIndex(pageIndex);
            }

            function updateControlButtons(isFirstPage, isLastPage) {
                $firstPage.SetEnabled(!isFirstPage);
                $prevPage.SetEnabled(!isFirstPage);
                $nextPage.SetEnabled(!isLastPage);
                $lastPage.SetEnabled(!isLastPage);
                $search.SetEnabled($documentViewer.GetViewer().IsSearchAllowed());
            }

            $documentViewer.PageLoad.AddHandler(function (s, e) {
                updatePageIndexes(e.PageCount, e.PageIndex);
                $pageCount.SetValue(e.PageCount);
                updateControlButtons(e.IsFirstPage(), e.IsLastPage());
            });
        });
    }
    toolbar.initialize = initialize;
})(window.toolbar || (window.toolbar = {}));