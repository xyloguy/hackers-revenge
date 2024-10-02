class ContendersController < ApplicationController
  DEFAULT_COUNT = 25

  def show
    render :json => ::Player.to_contenders_hash(count)
  end

private

  def count
    params[:count] || DEFAULT_COUNT
  end
end
