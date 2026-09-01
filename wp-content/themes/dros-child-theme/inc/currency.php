<?php

/*
 * USD Approximate Pricing
 * ------------------------
 * Indonesian regulations require checkout to be processed in Rupiah
 * (VikBooking's configured currency), but many guests think in USD. We
 * fetch a daily USD -> IDR reference rate (Frankfurter, a free ECB-backed
 * API - no key required) via WP-Cron, cache it in a single option, and
 * expose it to the front-end so script.js can show a rough "Approximately
 * $X USD" note next to room prices. The real amount charged is always
 * computed by Xendit (our payment processor) in IDR at checkout, so this
 * is for orientation only - script.js pairs it with a disclaimer to that
 * effect.
 */

define( 'DROS_USD_IDR_OPTION', 'dros_usd_idr_rate' );
define( 'DROS_USD_IDR_CRON_HOOK', 'dros_fetch_usd_idr_rate_event' );

// Make sure the daily refresh is scheduled, and grab a first rate right
// away if we've never fetched one - otherwise the feature would silently
// do nothing until the first cron run.
add_action( 'init', 'dros_schedule_usd_idr_rate_fetch' );

function dros_schedule_usd_idr_rate_fetch() {
	if ( ! wp_next_scheduled( DROS_USD_IDR_CRON_HOOK ) ) {
		wp_schedule_event( time(), 'daily', DROS_USD_IDR_CRON_HOOK );
	}

	if ( false === get_option( DROS_USD_IDR_OPTION, false ) ) {
		dros_fetch_usd_idr_rate();
	}
}

add_action( DROS_USD_IDR_CRON_HOOK, 'dros_fetch_usd_idr_rate' );

function dros_fetch_usd_idr_rate() {
	$response = wp_remote_get( 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=IDR', array(
		'timeout' => 10,
	) );

	if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
		// Leave whatever rate we already have cached in place rather than
		// breaking price display over a temporary network/API hiccup.
		return;
	}

	$body = json_decode( wp_remote_retrieve_body( $response ), true );
	$rate = isset( $body['rates']['IDR'] ) ? floatval( $body['rates']['IDR'] ) : 0;

	if ( $rate <= 0 ) {
		return;
	}

	update_option( DROS_USD_IDR_OPTION, array(
		'rate'    => $rate,
		'updated' => time(),
	), false );
}

// Used by inc/frontend.php to expose the cached rate to script.js.
function dros_get_usd_idr_rate() {
	$data = get_option( DROS_USD_IDR_OPTION, false );

	return ( $data && ! empty( $data['rate'] ) ) ? floatval( $data['rate'] ) : 0;
}
