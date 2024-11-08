// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

use std::cell::RefCell;
use std::rc::Rc;

use deno_core::anyhow;
use deno_core::op2;
use deno_core::OpState;

use crate::NodePermissions;

#[op2(async)]
#[serde]
pub async fn op_node_lookup_host<P>(
  _state: Rc<RefCell<OpState>>,
  #[string] host: String,
) -> anyhow::Result<Vec<String>>
where
  P: NodePermissions + 'static,
{
  /*
  let mut state = state.borrow_mut();
  state
    .borrow_mut::<P>()
    .check_sys("getaddrinfo", "getaddrinfo")?;
  */
  Ok(
    tokio::net::lookup_host((host, 0))
      .await?
      .map(|addr| addr.ip().to_string())
      .collect(),
  )
}
