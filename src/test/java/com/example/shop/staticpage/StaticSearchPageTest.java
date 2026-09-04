package com.example.shop.staticpage;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Structural regression tests for the Product Search Box feature
 * (Jira EPMCDMETST-62766) implemented entirely inline in
 * {@code src/main/resources/static/index.html}.
 *
 * <p>Because the frontend is a single plain-HTML/CSS/JS page with no
 * bundler, framework, or JS test runner (NFR3 explicitly forbids adding
 * one), these tests load the packaged static asset as text and assert on
 * its structure/markup/script content. They pin down the presence and
 * shape of the search feature and guard against regressions such as
 * accidentally introducing debounce, substring matching, or a new network
 * call - each of which is directly traceable to an acceptance criterion in
 * {@code src/docs/requirements.md}. Full interactive/DOM behavior (actual
 * keystroke-by-keystroke filtering) is expected to be exercised in the
 * Verification phase (e.g. via a browser-driven check), not here.</p>
 */
class StaticSearchPageTest {

    private static String html;

    @BeforeAll
    static void loadPage() throws IOException {
        try (InputStream in = StaticSearchPageTest.class.getClassLoader()
                .getResourceAsStream("static/index.html")) {
            assertThat(in).as("static/index.html must be on the classpath").isNotNull();
            html = new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    // ---------- Positive scenarios ----------

    @Test
    void searchInputIsRenderedAboveTheProductGrid_FR1() {
        int searchIndex = html.indexOf("id=\"search\"");
        int gridIndex = html.indexOf("id=\"products\"");

        assertThat(searchIndex).as("#search input must exist").isGreaterThanOrEqualTo(0);
        assertThat(gridIndex).as("#products grid must exist").isGreaterThanOrEqualTo(0);
        assertThat(searchIndex).as("#search must appear before #products in markup")
                .isLessThan(gridIndex);
    }

    @Test
    void searchInputListensOnNativeInputEvent_FR2_AC3() {
        assertThat(html).contains("getElementById('search').addEventListener('input'");
    }

    @Test
    void matchAlgorithmUsesCaseInsensitivePrefixOnly_FR3_AC1_AC8() {
        assertThat(html).contains("product.name.toLowerCase().startsWith(term)");
    }

    @Test
    void searchTermIsTrimmedBeforeMatching_AC6_AC7() {
        assertThat(html).contains("(rawTerm||'').trim().toLowerCase()");
    }

    @Test
    void emptyTrimmedTermIsTreatedAsNoFilter_AC5_AC6() {
        assertThat(html).contains("if(term==='')return true");
    }

    @Test
    void emptyResultsRenderNoProductsFoundMessage_FR4_AC4() {
        assertThat(html).contains("No products found");
    }

    @Test
    void renderProductsIsReusedForInitialLoadAndFilteredResults_FR5() {
        long renderCallCount = html.split("renderProducts\\(", -1).length - 1;
        assertThat(renderCallCount)
                .as("renderProducts should be defined once and invoked for both the initial load and filtering")
                .isEqualTo(3); // 1 definition + initial call + filtered call
    }

    @Test
    void onlyOneNetworkFetchExistsForTheWholePage_FR6_NFR2_AC9() {
        long fetchCallCount = html.split("fetch\\(", -1).length - 1;
        assertThat(fetchCallCount)
                .as("typing in the search box must not add a second fetch() call")
                .isEqualTo(1);
    }

    @Test
    void cartFunctionsRemainByteForByteUnchanged_FR7_NFR4_AC10() {
        assertThat(html).contains("function add(id){cart.push(products.find(x=>x.id===id));render()}");
        assertThat(html).contains("function render(){document.getElementById('items').innerHTML=cart.map(x=>'<p>'+x.name+'</p>').join('');document.getElementById('total').innerText=cart.reduce((a,b)=>a+b.price,0)}");
        assertThat(html).contains("function checkout(){alert('Order placed successfully! Total ₹'+document.getElementById('total').innerText);cart=[];render()}");
        assertThat(html).contains("onclick=add(${p.id})");
    }

    // ---------- Negative scenarios ----------

    @Test
    void substringContainsMatchingIsNotIntroduced_AC2() {
        assertThat(html).as("only startsWith prefix matching is allowed, never .includes() for name matching")
                .doesNotContain(".includes(");
    }

    @Test
    void noDebounceOrThrottleIsIntroduced_NFR1_AC3() {
        assertThat(html).doesNotContain("setTimeout");
        assertThat(html).doesNotContain("debounce");
        assertThat(html).doesNotContain("requestAnimationFrame");
    }

    // ---------- Boundary scenarios ----------

    @Test
    void searchHandlerReadsLiveInputValueRatherThanCachingIt() {
        // Guards against a stale-closure regression: the handler must read
        // #search's current .value on every event, not a value captured once.
        assertThat(html).contains("const term=document.getElementById('search').value;");
    }

    @Test
    void matchesHelperToleratesNullOrUndefinedTermWithoutThrowing() {
        // Boundary: rawTerm||'' guards against null/undefined being passed in.
        assertThat(html).contains("(rawTerm||'')");
    }
}
