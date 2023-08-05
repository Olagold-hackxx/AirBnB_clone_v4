$('document').ready(function () {
	const url = "http://localhost:5001/api/v1/status/";
	$.get(url, function (data) {
		if (data.status === "OK") {
			$('DIV#api_status').addClass("available");
		}
		else {
			$('DIV#api_status').removeClass("available");
		}
	})
	const placeUrl = "http://localhost:5001/api/v1/places_search/";
	function placeSearch (filter) {
		$.ajax({
			url: placeUrl,
			type: 'POST',
			data: filter,
			contentType: 'application/json',
			dataType: 'json',
			success: function(data) {
				$('SECTION.places').append();
				for (const place of data ) {
					let guest;
					let room;
					let bathroom;
					if (place.max_guest <= 1) {
						guest = "Guest";
					}
					else { guest = "Guests"; }
					if (place.number_rooms <= 1) {
						room = "Bedroom";
					}
					else { room = "Bedrooms"; }
					if (place.number_bathrooms <= 1) {
						bathroom = "Bathroom";
					}
					else { bathroom = "Bathrooms"; }
					const placeHtml = `<article>
					<div class="title_box">
					<h2>${place.name}</h2>
					<div class="price_by_night">$${place.price_by_night}</div>
					</div>
					<div class="information">
					<div class="max_guest">${place.max_guest } ${guest}</div>
						<div class="number_rooms">${place.number_rooms} ${room}</div>
						<div class="number_bathrooms">${place.number_bathrooms} ${bathroom}</div>
					</div>
					<div class="description">
					${place.description}
					</div>
					<div class="reviews">
						<h2 class="article_subtitle">Reviews</h2>
						<span>show</span>
						<ul></ul>
					</div>
				</article>`;
					$('SECTION.places').append(placeHtml);
					const reviewUrl = "http://localhost:5001/api/v1/places/" + place.id + "/reviews";
					$.get(url, function(reviews) {
						for (const review of reviews) {
							let username;
							const userUrl = "http://localhost:5001/api/v1/places/" + review.user_id;
							$.get(url, function(data) {
								username = data.first_name + " " + data.last_name;
							});
							const reviewHtml = `<li>
									<div class="review_item">
										<h3>From ${username} the ${review.updated_at}</h3>
										<p class="review_text">${review.text}</p>
									</div>
								</li>`;
							$('DIV.reviews UL').append(reviewHtml);
						}
					});
					}
		}});
	}
	placeSearch('{}');
	let check = [];
	let checkName = [];
	let checkState = [];
	let checkStateName = [];
	let checkCity = [];
	let checkCityName = [];
	function checkbox(idList, names, filter, appendArea) {
		$('INPUT[type="checkbox"].' + filter).change(function () {
			if ($(this).is(":checked")) {
				idList.push($(this).attr("data-id"));
				names.push($(this).attr("data-name"));
			}
			else {
				let index = check.indexOf($(this).attr("data-id"));
				idList.splice(index, 1);
				index = names.indexOf($(this).attr("data-name"));
				names.splice(index, 1);
			}
			$('DIV.' + appendArea +  ' H4').text(names.join(", "));
			});
		}
	checkbox(check, checkName, 'amenity', 'amenities');
	checkbox(checkState, checkStateName, 'state', 'locations');
	checkbox(checkCity, checkCityName, 'city', 'locations');


	$('BUTTON').on('click', function () {
		$('SECTION ARTICLE').remove();
		placeSearch(JSON.stringify({"amenities": check, "states": checkState, "cities": checkCity }));
	})
});
